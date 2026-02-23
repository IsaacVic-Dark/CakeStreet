<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Models\Payment;
use App\Models\Order;
use Carbon\Carbon;

class MpesaService
{
    protected $consumerKey;
    protected $consumerSecret;
    protected $businessShortCode;
    protected $passkey;
    protected $environment;
    protected $callbackUrl;

    public function __construct()
    {
        $this->consumerKey = config('mpesa.consumer_key');
        $this->consumerSecret = config('mpesa.consumer_secret');
        $this->businessShortCode = config('mpesa.business_short_code');
        $this->passkey = config('mpesa.passkey');
        $this->environment = config('mpesa.environment');
        $this->callbackUrl = config('mpesa.callback_url');
    }

    /**
     * Generate OAuth Token
     */
    protected function generateToken()
    {
        $url = config('mpesa.oauth_url');
        
        $response = Http::withBasicAuth($this->consumerKey, $this->consumerSecret)
            ->get($url);

        if ($response->successful()) {
            return $response->json()['access_token'];
        }

        Log::error('M-Pesa Token Generation Failed', [
            'response' => $response->body()
        ]);

        throw new \Exception('Failed to generate M-Pesa token');
    }

    /**
     * Initiate STK Push
     */
    public function stkPush(Order $order, Payment $payment, string $phoneNumber)
    {
        try {
            $token = $this->generateToken();
            
            $timestamp = now()->format('YmdHis');
            $password = base64_encode(
                $this->businessShortCode . $this->passkey . $timestamp
            );

            $payload = [
                'BusinessShortCode' => $this->businessShortCode,
                'Password' => $password,
                'Timestamp' => $timestamp,
                'TransactionType' => config('mpesa.transaction_type'),
                'Amount' => $order->total,
                'PartyA' => $this->formatPhoneNumber($phoneNumber),
                'PartyB' => $this->businessShortCode,
                'PhoneNumber' => $this->formatPhoneNumber($phoneNumber),
                'CallBackURL' => $this->callbackUrl,
                'AccountReference' => $order->order_number,
                'TransactionDesc' => 'Payment for Order #' . $order->order_number,
            ];

            Log::info('M-Pesa STK Push Request', $payload);

            $response = Http::withToken($token)
                ->post(config('mpesa.stk_push_url'), $payload);

            if ($response->successful()) {
                $result = $response->json();
                
                // Update payment with M-Pesa specific data
                $payment->update([
                    'mpesa_checkout_request_id' => $result['CheckoutRequestID'] ?? null,
                    'mpesa_merchant_request_id' => $result['MerchantRequestID'] ?? null,
                    'mpesa_response' => json_encode($result),
                    'status' => 'processing',
                    'last_attempt_at' => now(),
                    'attempt_count' => $payment->attempt_count + 1,
                ]);

                Log::info('M-Pesa STK Push Success', $result);

                return [
                    'success' => true,
                    'checkout_request_id' => $result['CheckoutRequestID'],
                    'response' => $result
                ];
            }

            Log::error('M-Pesa STK Push Failed', [
                'response' => $response->body()
            ]);

            $this->handleFailedPush($payment, $response->body());

            return [
                'success' => false,
                'message' => 'Failed to initiate M-Pesa payment'
            ];

        } catch (\Exception $e) {
            Log::error('M-Pesa STK Push Exception', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            $this->handleFailedPush($payment, $e->getMessage());

            return [
                'success' => false,
                'message' => 'An error occurred while processing M-Pesa payment'
            ];
        }
    }

    /**
     * Query STK Push Status
     */
    public function queryStatus(string $checkoutRequestId)
    {
        try {
            $token = $this->generateToken();
            
            $timestamp = now()->format('YmdHis');
            $password = base64_encode(
                $this->businessShortCode . $this->passkey . $timestamp
            );

            $payload = [
                'BusinessShortCode' => $this->businessShortCode,
                'Password' => $password,
                'Timestamp' => $timestamp,
                'CheckoutRequestID' => $checkoutRequestId
            ];

            $response = Http::withToken($token)
                ->post(config('mpesa.query_url'), $payload);

            return $response->json();

        } catch (\Exception $e) {
            Log::error('M-Pesa Query Failed', [
                'error' => $e->getMessage()
            ]);
            
            return null;
        }
    }

    /**
     * Handle M-Pesa Callback
     */
    public function handleCallback(array $data)
    {
        try {
            $callbackData = $data['Body']['stkCallback'];
            $checkoutRequestId = $callbackData['CheckoutRequestID'];
            $resultCode = $callbackData['ResultCode'];
            $resultDesc = $callbackData['ResultDesc'];

            // Find the payment
            $payment = Payment::where('mpesa_checkout_request_id', $checkoutRequestId)->first();

            if (!$payment) {
                Log::error('M-Pesa Callback: Payment not found', [
                    'checkout_request_id' => $checkoutRequestId
                ]);
                return false;
            }

            // Update payment with callback data
            $payment->update([
                'callback_data' => $data,
                'status' => $resultCode == 0 ? 'completed' : 'failed',
                'error_message' => $resultCode != 0 ? $resultDesc : null,
                'paid_at' => $resultCode == 0 ? now() : null,
            ]);

            if ($resultCode == 0) {
                // Successful payment
                $metadata = $callbackData['CallbackMetadata']['Item'] ?? [];
                
                // Extract M-Pesa receipt number
                foreach ($metadata as $item) {
                    if ($item['Name'] == 'MpesaReceiptNumber') {
                        $payment->mpesa_receipt_number = $item['Value'];
                        $payment->transaction_id = $item['Value'];
                    }
                }
                
                $payment->save();

                // Update order payment status
                $payment->order->update([
                    'payment_status' => 'paid',
                    'payment_reference' => $payment->mpesa_receipt_number,
                    'payment_metadata' => array_merge(
                        $payment->order->payment_metadata ?? [],
                        ['mpesa_callback' => $data]
                    ),
                    'status' => 'confirmed' // Move order to confirmed
                ]);

                Log::info('M-Pesa Payment Successful', [
                    'order_id' => $payment->order_id,
                    'receipt' => $payment->mpesa_receipt_number
                ]);
            } else {
                // Failed payment - schedule retry if attempts remain
                $this->scheduleRetry($payment);
            }

            return true;

        } catch (\Exception $e) {
            Log::error('M-Pesa Callback Processing Failed', [
                'error' => $e->getMessage(),
                'data' => $data
            ]);
            
            return false;
        }
    }

    /**
     * Handle Failed STK Push
     */
    protected function handleFailedPush(Payment $payment, string $error)
    {
        $payment->update([
            'status' => 'failed',
            'error_message' => $error,
            'last_attempt_at' => now(),
            'attempt_count' => $payment->attempt_count + 1,
        ]);

        $this->scheduleRetry($payment);
    }

    /**
     * Schedule Retry for Failed Payment
     */
    protected function scheduleRetry(Payment $payment)
    {
        if ($payment->attempt_count < config('mpesa.max_retry_attempts')) {
            $nextAttempt = now()->addMinutes(config('mpesa.retry_delay_minutes'));
            
            $payment->update([
                'status' => 'pending',
                'next_attempt_at' => $nextAttempt,
            ]);

            // Dispatch retry job
            \App\Jobs\RetryMpesaPayment::dispatch($payment)
                ->delay($nextAttempt);
        }
    }

    /**
     * Format Phone Number to Safaricom format (254XXXXXXXXX)
     */
    protected function formatPhoneNumber(string $phone): string
    {
        // Remove any non-numeric characters
        $phone = preg_replace('/[^0-9]/', '', $phone);
        
        // If starts with 0, replace with 254
        if (substr($phone, 0, 1) == '0') {
            $phone = '254' . substr($phone, 1);
        }
        
        // If starts with 7, add 254
        if (substr($phone, 0, 1) == '7') {
            $phone = '254' . $phone;
        }
        
        return $phone;
    }
}
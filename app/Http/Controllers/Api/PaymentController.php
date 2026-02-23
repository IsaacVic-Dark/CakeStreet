<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Payment;
use App\Services\MpesaService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class PaymentController extends Controller
{
    protected $mpesaService;

    public function __construct(MpesaService $mpesaService)
    {
        $this->mpesaService = $mpesaService;
    }

    /**
     * Process checkout and initiate payment
     */
    public function processCheckout(Request $request)
    {
        $request->validate([
            'delivery_type' => 'required|in:delivery,pickup',
            'delivery_address' => 'required_if:delivery_type,delivery',
            'delivery_city' => 'required_if:delivery_type,delivery',
            'delivery_date' => 'required|date|after:today',
            'delivery_time_slot' => 'required',
            'payment_method' => 'required|in:mpesa,stripe,paypal,airtel_money,cash',
            'phone_number' => 'required_if:payment_method,mpesa|nullable|string',
            'special_instructions' => 'nullable|string',
        ]);

        try {
            DB::beginTransaction();

            // Get cart items from session/cache (you'll need to implement this)
            $cartItems = $this->getCartItems();
            $subtotal = $this->calculateSubtotal($cartItems);
            $tax = $subtotal * 0.16;
            $deliveryFee = $request->delivery_type === 'delivery' ? 500 : 0;
            $total = $subtotal + $tax + $deliveryFee;

            // Create order
            $order = Order::create([
                'order_number' => $this->generateOrderNumber(),
                'bakery_id' => $this->getBakeryIdFromCart($cartItems), // You'll need to implement
                'customer_id' => auth()->id(),
                'order_type' => 'catalog',
                'delivery_type' => $request->delivery_type,
                'delivery_address' => $request->delivery_address,
                'delivery_city' => $request->delivery_city,
                'delivery_date' => $request->delivery_date,
                'delivery_time_slot' => $request->delivery_time_slot,
                'delivery_fee' => $deliveryFee,
                'subtotal' => $subtotal,
                'tax' => $tax,
                'total' => $total,
                'status' => 'pending',
                'payment_status' => 'pending',
                'payment_method' => $request->payment_method,
                'special_instructions' => $request->special_instructions,
            ]);

            // Create order items
            foreach ($cartItems as $item) {
                $order->items()->create([
                    'product_id' => $item['product_id'],
                    'product_name' => $item['product']['name'],
                    'product_snapshot' => $item['product'],
                    'customization' => $item['customization'] ?? null,
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'total_price' => $item['quantity'] * $item['unit_price'],
                ]);
            }

            // Create payment record
            $payment = Payment::create([
                'order_id' => $order->id,
                'user_id' => auth()->id(),
                'gateway' => $request->payment_method,
                'amount' => $total,
                'currency' => 'KES',
                'status' => 'pending',
                'phone_number' => $request->phone_number,
                'attempt_count' => 0,
                'metadata' => [
                    'delivery_type' => $request->delivery_type,
                    'delivery_date' => $request->delivery_date,
                ],
            ]);

            // Handle different payment methods
            switch ($request->payment_method) {
                case 'mpesa':
                    // For pickup orders, don't process payment immediately
                    if ($request->delivery_type === 'pickup') {
                        DB::commit();
                        return redirect()->route('orders.show', $order->order_number)
                            ->with('success', 'Order placed successfully. Please complete payment on pickup.');
                    }

                    // Initiate STK push for delivery orders
                    $result = $this->mpesaService->stkPush($order, $payment, $request->phone_number);
                    
                    if (!$result['success']) {
                        throw new \Exception('Failed to initiate M-Pesa payment');
                    }

                    DB::commit();

                    // Return Inertia response with payment modal
                    return Inertia::render('Checkout/PaymentModal', [
                        'order' => $order,
                        'payment' => $payment,
                        'checkout_request_id' => $result['checkout_request_id'],
                    ]);

                case 'cash':
                    // Cash on delivery/pickup - order is pending payment
                    DB::commit();
                    return redirect()->route('orders.show', $order->order_number)
                        ->with('success', 'Order placed successfully. Please have cash ready.');

                case 'stripe':
                    DB::commit();
                    // Redirect to Stripe Checkout
                    return $this->redirectToStripe($order, $payment);

                case 'paypal':
                    DB::commit();
                    // Redirect to PayPal Checkout
                    return $this->redirectToPayPal($order, $payment);

                case 'airtel_money':
                    DB::commit();
                    // Handle Airtel Money
                    return $this->processAirtelMoney($order, $payment);

                default:
                    throw new \Exception('Invalid payment method');
            }

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Checkout failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return back()->withErrors(['error' => 'Failed to process checkout: ' . $e->getMessage()]);
        }
    }

    /**
     * Check payment status (for polling)
     */
    public function checkPaymentStatus(Payment $payment)
    {
        if ($payment->gateway !== 'mpesa') {
            return response()->json([
                'status' => $payment->status,
                'paid_at' => $payment->paid_at,
            ]);
        }

        // For M-Pesa, we can query the status
        if ($payment->mpesa_checkout_request_id) {
            $status = $this->mpesaService->queryStatus($payment->mpesa_checkout_request_id);
            
            return response()->json([
                'status' => $payment->status,
                'mpesa_status' => $status,
                'paid_at' => $payment->paid_at,
            ]);
        }

        return response()->json([
            'status' => $payment->status,
            'paid_at' => $payment->paid_at,
        ]);
    }

    /**
     * Retry failed payment
     */
    public function retryPayment(Payment $payment, Request $request)
    {
        if (!$payment->canRetry()) {
            return back()->withErrors(['error' => 'Payment cannot be retried']);
        }

        $request->validate([
            'phone_number' => 'required_if:gateway,mpesa|string',
        ]);

        if ($payment->gateway === 'mpesa') {
            $result = $this->mpesaService->stkPush(
                $payment->order, 
                $payment, 
                $request->phone_number ?? $payment->phone_number
            );

            if ($result['success']) {
                return Inertia::render('Checkout/PaymentModal', [
                    'order' => $payment->order,
                    'payment' => $payment,
                    'checkout_request_id' => $result['checkout_request_id'],
                ]);
            }
        }

        return back()->withErrors(['error' => 'Failed to retry payment']);
    }

    /**
     * M-Pesa Callback Handler
     */
    public function mpesaCallback(Request $request)
    {
        Log::info('M-Pesa Callback Received', $request->all());

        $processed = $this->mpesaService->handleCallback($request->all());

        return response()->json([
            'ResultCode' => 0,
            'ResultDesc' => 'Success'
        ]);
    }

    /**
     * M-Pesa Timeout Handler
     */
    public function mpesaTimeout(Request $request)
    {
        Log::warning('M-Pesa Timeout', $request->all());

        return response()->json([
            'ResultCode' => 0,
            'ResultDesc' => 'Success'
        ]);
    }

    // Helper methods (implement these based on your business logic)
    protected function generateOrderNumber()
    {
        return 'ORD-' . strtoupper(uniqid());
    }

    protected function getCartItems()
    {
        // Implement based on your cart storage (session, database, etc.)
        return session()->get('cart', []);
    }

    protected function calculateSubtotal($items)
    {
        return collect($items)->sum(function ($item) {
            return $item['quantity'] * $item['unit_price'];
        });
    }

    protected function getBakeryIdFromCart($items)
    {
        // Assuming all items are from same bakery
        return $items[0]['product']['bakery_id'] ?? null;
    }

    protected function redirectToStripe($order, $payment)
    {
        // Implement Stripe Checkout redirect
        // Return Inertia location redirect
    }

    protected function redirectToPayPal($order, $payment)
    {
        // Implement PayPal Checkout redirect
    }

    protected function processAirtelMoney($order, $payment)
    {
        // Implement Airtel Money
    }
}
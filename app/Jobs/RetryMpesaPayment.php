<?php

namespace App\Jobs;

use App\Models\Payment;
use App\Services\MpesaService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class RetryMpesaPayment implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $payment;

    public function __construct(Payment $payment)
    {
        $this->payment = $payment;
    }

    public function handle(MpesaService $mpesaService)
    {
        if (!$this->payment->canRetry()) {
            Log::info('Payment cannot be retried', [
                'payment_id' => $this->payment->id
            ]);
            return;
        }

        Log::info('Retrying M-Pesa payment', [
            'payment_id' => $this->payment->id,
            'attempt' => $this->payment->attempt_count + 1
        ]);

        $result = $mpesaService->stkPush(
            $this->payment->order,
            $this->payment,
            $this->payment->phone_number
        );

        if (!$result['success']) {
            // If retry failed and still has attempts, job will be rescheduled by handleFailedPush
            Log::warning('M-Pesa retry failed', [
                'payment_id' => $this->payment->id
            ]);
        }
    }
}
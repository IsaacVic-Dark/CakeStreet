<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    use HasFactory, HasUuids;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'order_id',
        'user_id',
        'gateway',
        'payment_type',
        'transaction_id',
        'reference_number',
        'mpesa_receipt_number',
        'amount',
        'refunded_amount',
        'currency',
        'status',
        'phone_number',
        'mpesa_checkout_request_id',
        'mpesa_merchant_request_id',
        'mpesa_response',
        'callback_data',
        'attempt_count',
        'last_attempt_at',
        'next_attempt_at',
        'metadata',
        'error_message',
        'paid_at',
        'refunded_at',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'refunded_amount' => 'decimal:2',
        'attempt_count' => 'integer',
        'last_attempt_at' => 'datetime',
        'next_attempt_at' => 'datetime',
        'paid_at' => 'datetime',
        'refunded_at' => 'datetime',
        'metadata' => 'array',
        'callback_data' => 'array',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function isSuccessful(): bool
    {
        return $this->status === 'completed';
    }

    public function isPending(): bool
    {
        return in_array($this->status, ['pending', 'processing']);
    }

    public function canRetry(): bool
    {
        return $this->status === 'failed' && 
               $this->attempt_count < config('mpesa.max_retry_attempts');
    }
}
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('order_id')->constrained('orders')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            
            // Payment gateway specific fields
            $table->enum('gateway', ['mpesa', 'stripe', 'paypal', 'airtel_money', 'cash']);
            $table->enum('payment_type', ['one_time', 'refund'])->default('one_time');
            
            // Transaction identifiers
            $table->string('transaction_id')->nullable()->unique(); // Gateway transaction ID
            $table->string('reference_number')->nullable(); // Our internal reference
            $table->string('mpesa_receipt_number')->nullable(); // M-Pesa specific
            
            // Amount tracking
            $table->decimal('amount', 10, 2);
            $table->decimal('refunded_amount', 10, 2)->default(0);
            $table->string('currency', 3)->default('KES');
            
            // Status tracking
            $table->enum('status', [
                'pending', 
                'processing', 
                'completed', 
                'failed', 
                'refunded', 
                'partially_refunded',
                'expired'
            ])->default('pending');
            
            // M-Pesa specific fields
            $table->string('phone_number')->nullable(); // For STK push
            $table->string('mpesa_checkout_request_id')->nullable();
            $table->string('mpesa_merchant_request_id')->nullable();
            $table->text('mpesa_response')->nullable(); // Raw response from Safaricom
            $table->json('callback_data')->nullable(); // Full callback payload
            
            // Retry mechanism
            $table->integer('attempt_count')->default(0);
            $table->timestamp('last_attempt_at')->nullable();
            $table->timestamp('next_attempt_at')->nullable();
            
            // Metadata
            $table->json('metadata')->nullable();
            $table->text('error_message')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamp('refunded_at')->nullable();
            
            $table->timestamps();
            
            // Indexes for performance
            $table->index(['order_id', 'status']);
            $table->index(['gateway', 'status']);
            $table->index('mpesa_checkout_request_id');
            $table->index('transaction_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
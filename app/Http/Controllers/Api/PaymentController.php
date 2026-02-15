<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Stripe\PaymentIntent;
use Stripe\Stripe;

class PaymentController extends Controller
{
    public function initiateMpesa(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'order_id' => 'required|exists:orders,id',
            'phone_number' => 'required|string',
        ]);

        $order = Order::findOrFail($validated['order_id']);

        if ($order->customer_id !== auth()->id()) {
            abort(403);
        }

        // Stub: in production, call Safaricom STK Push API
        return response()->json([
            'success' => true,
            'message' => 'M-Pesa payment initiated. Please check your phone.',
            'order_id' => $order->id,
        ]);
    }

    public function mpesaCallback(Request $request): JsonResponse
    {
        $data = $request->all();
        // In production: verify callback, find order by reference, update payment_status
        return response()->json(['ResultCode' => 0, 'ResultDesc' => 'Success']);
    }

    public function createStripeIntent(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'order_id' => 'required|exists:orders,id',
        ]);

        $order = Order::findOrFail($validated['order_id']);

        if ($order->customer_id !== auth()->id()) {
            abort(403);
        }

        $secret = config('services.stripe.secret', env('STRIPE_SECRET'));
        if ($secret) {
            Stripe::setApiKey($secret);
            $paymentIntent = PaymentIntent::create([
                'amount' => (int) round($order->total * 100),
                'currency' => 'kes',
                'metadata' => [
                    'order_id' => $order->id,
                    'order_number' => $order->order_number,
                ],
            ]);
            return response()->json([
                'clientSecret' => $paymentIntent->client_secret,
                'order_id' => $order->id,
            ]);
        }

        return response()->json([
            'clientSecret' => null,
            'order_id' => $order->id,
            'message' => 'Stripe not configured. Use test mode.',
        ]);
    }
}

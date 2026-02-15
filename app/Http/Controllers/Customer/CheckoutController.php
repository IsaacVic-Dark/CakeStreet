<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    public function index(): Response|RedirectResponse
    {
        $cartItems = CartItem::with(['product.bakery', 'cakeDesign'])
            ->where('user_id', auth()->id())
            ->get();

        if ($cartItems->isEmpty()) {
            return redirect()->route('cart.index')->with('error', 'Your cart is empty');
        }

        $subtotal = $cartItems->sum(function ($item) {
            $price = $item->customization['size']['price'] ?? $item->product->base_price ?? 0;
            return $price * $item->quantity;
        });

        return Inertia::render('Checkout/Index', [
            'cartItems' => $cartItems,
            'subtotal' => (float) $subtotal,
        ]);
    }

    public function process(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'delivery_type' => 'required|in:delivery,pickup',
            'delivery_address' => 'required_if:delivery_type,delivery|nullable|string',
            'delivery_city' => 'nullable|string|max:100',
            'delivery_date' => 'required|date|after:today',
            'delivery_time_slot' => 'required|string|max:50',
            'payment_method' => 'required|in:mpesa,stripe,cash',
            'special_instructions' => 'nullable|string',
        ]);

        $cartItems = CartItem::with('product.bakery')
            ->where('user_id', auth()->id())
            ->get();

        if ($cartItems->isEmpty()) {
            return back()->with('error', 'Your cart is empty');
        }

        DB::beginTransaction();
        try {
            $subtotal = $cartItems->sum(function ($item) {
                $price = $item->customization['size']['price'] ?? $item->product->base_price ?? 0;
                return $price * $item->quantity;
            });

            $deliveryFee = $validated['delivery_type'] === 'delivery' ? 500 : 0;
            $tax = $subtotal * 0.16;
            $total = $subtotal + $deliveryFee + $tax;

            $order = Order::create([
                'bakery_id' => $cartItems->first()->product->bakery_id,
                'customer_id' => auth()->id(),
                'order_type' => 'catalog',
                'delivery_type' => $validated['delivery_type'],
                'delivery_address' => $validated['delivery_address'] ?? null,
                'delivery_city' => $validated['delivery_city'] ?? null,
                'delivery_date' => $validated['delivery_date'],
                'delivery_time_slot' => $validated['delivery_time_slot'],
                'delivery_fee' => $deliveryFee,
                'subtotal' => $subtotal,
                'tax' => $tax,
                'total' => $total,
                'payment_method' => $validated['payment_method'],
                'special_instructions' => $validated['special_instructions'] ?? null,
                'status' => 'pending',
                'payment_status' => 'pending',
            ]);

            foreach ($cartItems as $cartItem) {
                $price = $cartItem->customization['size']['price'] ?? $cartItem->product->base_price ?? 0;

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $cartItem->product_id,
                    'cake_design_id' => $cartItem->cake_design_id,
                    'product_name' => $cartItem->product->name,
                    'product_snapshot' => $cartItem->product->toArray(),
                    'customization' => $cartItem->customization,
                    'quantity' => $cartItem->quantity,
                    'unit_price' => $price,
                    'total_price' => $price * $cartItem->quantity,
                ]);
            }

            CartItem::where('user_id', auth()->id())->delete();

            DB::commit();

            if ($validated['payment_method'] === 'mpesa') {
                return redirect()->route('customer.orders.show', $order->id)
                    ->with('success', 'Order placed. Complete M-Pesa payment on your phone.');
            }
            if ($validated['payment_method'] === 'stripe') {
                return redirect()->route('customer.orders.show', $order->id)
                    ->with('success', 'Order placed. Complete card payment on the next screen.');
            }

            return redirect()->route('customer.orders.show', $order->id)
                ->with('success', 'Order placed successfully!');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to process order: '.$e->getMessage());
        }
    }
}

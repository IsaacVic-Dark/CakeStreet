<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    public function index(): Response
    {
        $cartItems = CartItem::with(['product.bakery', 'cakeDesign'])
            ->where('user_id', auth()->id())
            ->get();

        $subtotal = $cartItems->sum(function ($item) {
            $price = $item->customization['size']['price'] ?? $item->product->base_price ?? 0;
            return $price * $item->quantity;
        });

        return Inertia::render('Cart/Index', [
            'cartItems' => $cartItems,
            'subtotal' => (float) $subtotal,
            'cartCount' => $cartItems->count(),
        ]);
    }

    public function add(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
            'customization' => 'nullable|array',
            'cake_design_id' => 'nullable|exists:cake_designs,id',
        ]);

        CartItem::updateOrCreate(
            [
                'user_id' => auth()->id(),
                'product_id' => $validated['product_id'],
            ],
            [
                'quantity' => $validated['quantity'],
                'customization' => $validated['customization'] ?? null,
                'cake_design_id' => $validated['cake_design_id'] ?? null,
            ]
        );

        return back()->with('success', 'Item added to cart');
    }

    public function update(Request $request, CartItem $item): RedirectResponse
    {
        if ($item->user_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $item->update($validated);

        return back()->with('success', 'Cart updated');
    }

    public function destroy(CartItem $item): RedirectResponse
    {
        if ($item->user_id !== auth()->id()) {
            abort(403);
        }

        $item->delete();

        return back()->with('success', 'Item removed from cart');
    }
}

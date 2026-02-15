<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function index(): Response
    {
        $bakery = auth()->user()->bakery;
        if (! $bakery) {
            return Inertia::render('Owner/Dashboard');
        }

        $orders = Order::with(['customer', 'items'])
            ->where('bakery_id', $bakery->id)
            ->latest()
            ->paginate(15);

        return Inertia::render('Owner/Orders/Index', [
            'orders' => $orders,
        ]);
    }

    public function show(Order $order): Response|RedirectResponse
    {
        $bakery = auth()->user()->bakery;
        if (! $bakery || $order->bakery_id !== $bakery->id) {
            abort(403);
        }

        $order->load(['customer', 'items']);

        return Inertia::render('Owner/Orders/Show', [
            'order' => $order,
        ]);
    }

    public function updateStatus(Request $request, Order $order): RedirectResponse
    {
        $bakery = auth()->user()->bakery;
        if (! $bakery || $order->bakery_id !== $bakery->id) {
            abort(403);
        }

        $validated = $request->validate([
            'status' => 'required|in:pending,confirmed,preparing,ready,out_for_delivery,delivered,cancelled',
        ]);

        $order->update($validated);

        return back()->with('success', 'Order status updated');
    }
}

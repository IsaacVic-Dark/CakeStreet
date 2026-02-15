<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function index(Request $request): Response
    {
        $orders = Order::with(['bakery', 'items'])
            ->where('customer_id', auth()->id())
            ->latest()
            ->paginate(10);

        return Inertia::render('Orders/Index', [
            'orders' => $orders,
        ]);
    }

    public function show(Order $order): Response
    {
        if ($order->customer_id !== auth()->id()) {
            abort(403);
        }

        $order->load(['bakery', 'items']);

        return Inertia::render('Orders/Show', [
            'order' => $order,
        ]);
    }
}

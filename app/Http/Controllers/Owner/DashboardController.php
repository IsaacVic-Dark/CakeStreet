<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class DashboardController extends Controller
{
    public function index(): Response|RedirectResponse
    {
        $user = auth()->user();
        $bakery = $user->bakery;

        if (! $bakery) {
            return redirect()->route('owner.bakery.create')
                ->with('info', 'Please set up your bakery first');
        }

        $totalOrders = Order::where('bakery_id', $bakery->id)->count();
        $pendingOrders = Order::where('bakery_id', $bakery->id)->where('status', 'pending')->count();
        $totalRevenue = Order::where('bakery_id', $bakery->id)->where('payment_status', 'paid')->sum('total');
        $totalProducts = Product::where('bakery_id', $bakery->id)->count();

        $recentOrders = Order::with('customer')
            ->where('bakery_id', $bakery->id)
            ->latest()
            ->limit(10)
            ->get();

        $salesData = Order::where('bakery_id', $bakery->id)
            ->where('created_at', '>=', now()->subDays(7))
            ->where('payment_status', 'paid')
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('SUM(total) as total'))
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return Inertia::render('Owner/Dashboard', [
            'bakery' => $bakery,
            'stats' => [
                'totalOrders' => $totalOrders,
                'pendingOrders' => $pendingOrders,
                'totalRevenue' => (float) $totalRevenue,
                'totalProducts' => $totalProducts,
            ],
            'recentOrders' => $recentOrders,
            'salesData' => $salesData,
        ]);
    }
}

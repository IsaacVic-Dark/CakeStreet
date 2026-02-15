<?php

use App\Http\Controllers\Auth\GoogleAuthController;
use App\Http\Controllers\Customer\CartController;
use App\Http\Controllers\Customer\CatalogController;
use App\Http\Controllers\Customer\CakeDesignerController;
use App\Http\Controllers\Customer\CheckoutController;
use App\Http\Controllers\Customer\OrderController as CustomerOrderController;
use App\Http\Controllers\Owner\BakeryController;
use App\Http\Controllers\Owner\DashboardController as OwnerDashboardController;
use App\Http\Controllers\Owner\OrderController as OwnerOrderController;
use App\Http\Controllers\Owner\ProductController as OwnerProductController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// Public routes
Route::get('/', [CatalogController::class, 'index'])->name('home');
Route::get('/products', [CatalogController::class, 'index'])->name('products.index');
Route::get('/products/{slug}', [CatalogController::class, 'show'])->name('products.show');

// Google OAuth
Route::get('/auth/google', [GoogleAuthController::class, 'redirect'])->name('auth.google');
Route::get('/auth/google/callback', [GoogleAuthController::class, 'callback']);

// Authenticated customer routes
Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Cart
    Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
    Route::post('/cart/add', [CartController::class, 'add'])->name('cart.add');
    Route::patch('/cart/{item}', [CartController::class, 'update'])->name('cart.update');
    Route::delete('/cart/{item}', [CartController::class, 'destroy'])->name('cart.destroy');

    // Checkout
    Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout.index');
    Route::post('/checkout', [CheckoutController::class, 'process'])->name('checkout.process');

    // Cake Designer
    Route::get('/designer', [CakeDesignerController::class, 'index'])->name('designer.index');
    Route::get('/designer/new', [CakeDesignerController::class, 'create'])->name('designer.create');
    Route::post('/designer/save', [CakeDesignerController::class, 'save'])->name('designer.save');
    Route::get('/designer/{design}', [CakeDesignerController::class, 'edit'])->name('designer.edit');

    // Customer Orders
    Route::get('/my-orders', [CustomerOrderController::class, 'index'])->name('customer.orders.index');
    Route::get('/my-orders/{order}', [CustomerOrderController::class, 'show'])->name('customer.orders.show');
});

// Owner/Admin routes
Route::middleware(['auth', 'role:owner,admin'])->prefix('owner')->name('owner.')->group(function () {
    Route::get('/dashboard', [OwnerDashboardController::class, 'index'])->name('dashboard');

    Route::get('/bakery', function () {
        $bakery = auth()->user()->bakery;
        if (! $bakery) {
            return redirect()->route('owner.bakery.create');
        }
        return redirect()->route('owner.bakery.edit', $bakery);
    })->name('bakery.index');
    Route::get('/bakery/create', [BakeryController::class, 'create'])->name('bakery.create');
    Route::post('/bakery', [BakeryController::class, 'store'])->name('bakery.store');
    Route::get('/bakery/{bakery}/edit', [BakeryController::class, 'edit'])->name('bakery.edit');
    Route::patch('/bakery/{bakery}', [BakeryController::class, 'update'])->name('bakery.update');

    Route::resource('products', OwnerProductController::class);

    Route::get('/orders', [OwnerOrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/{order}', [OwnerOrderController::class, 'show'])->name('orders.show');
    Route::patch('/orders/{order}/status', [OwnerOrderController::class, 'updateStatus'])->name('orders.update-status');
});

require __DIR__.'/auth.php';

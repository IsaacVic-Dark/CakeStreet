<?php

use App\Http\Controllers\Api\CakeDesignController as ApiCakeDesignController;
use App\Http\Controllers\Api\PaymentController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::post('/mpesa/callback', [PaymentController::class, 'mpesaCallback']);
Route::post('/mpesa/timeout', [PaymentController::class, 'mpesaTimeout']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (\Illuminate\Http\Request $request) {
        return $request->user();
    });

    // Payment endpoints
    Route::post('/payments/mpesa/initiate', [PaymentController::class, 'initiateMpesa'])->name('api.payments.mpesa');
    Route::post('/payments/stripe/intent', [PaymentController::class, 'createStripeIntent'])->name('api.payments.stripe.intent');

    // Cake design API
    Route::post('/designs/export', [ApiCakeDesignController::class, 'export'])->name('api.designs.export');
});

// M-Pesa callback (no auth - called by Safaricom)
Route::post('/payments/mpesa/callback', [PaymentController::class, 'mpesaCallback'])->name('api.payments.mpesa.callback');

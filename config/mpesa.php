<?php

return [
    /*
    |--------------------------------------------------------------------------
    | M-Pesa Environment
    |--------------------------------------------------------------------------
    */
    'environment' => env('MPESA_ENVIRONMENT', 'sandbox'),
    
    /*
    |--------------------------------------------------------------------------
    | M-Pesa Credentials
    |--------------------------------------------------------------------------
    */
    'consumer_key' => env('MPESA_CONSUMER_KEY'),
    'consumer_secret' => env('MPESA_CONSUMER_SECRET'),
    'business_short_code' => env('MPESA_BUSINESS_SHORT_CODE'),
    'passkey' => env('MPESA_PASSKEY'),
    
    /*
    |--------------------------------------------------------------------------
    | M-Pesa URLs
    |--------------------------------------------------------------------------
    */
    'stk_push_url' => env('MPESA_ENVIRONMENT') === 'sandbox' 
        ? 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest'
        : 'https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
    
    'query_url' => env('MPESA_ENVIRONMENT') === 'sandbox'
        ? 'https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query'
        : 'https://api.safaricom.co.ke/mpesa/stkpushquery/v1/query',
    
    'oauth_url' => env('MPESA_ENVIRONMENT') === 'sandbox'
        ? 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'
        : 'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
    
    /*
    |--------------------------------------------------------------------------
    | Callback URLs
    |--------------------------------------------------------------------------
    | Use ngrok URL for development
    */
    'callback_url' => env('MPESA_CALLBACK_URL', 'https://your-ngrok-url.ngrok.io/api/mpesa/callback'),
    'timeout_url' => env('MPESA_TIMEOUT_URL', 'https://your-ngrok-url.ngrok.io/api/mpesa/timeout'),
    
    /*
    |--------------------------------------------------------------------------
    | Transaction Settings
    |--------------------------------------------------------------------------
    */
    'transaction_type' => 'CustomerPayBillOnline',
    'max_retry_attempts' => 3,
    'retry_delay_minutes' => 5, // Minutes between retry attempts
];
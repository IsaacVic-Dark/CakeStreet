import React, { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import { Payment, Order } from '@/types';

interface Props {
    order: Order;
    payment: Payment;
    checkout_request_id: string;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    onRetry: (phoneNumber: string) => void;
}

export default function PaymentModal({ 
    order, 
    payment, 
    checkout_request_id, 
    isOpen, 
    onClose,
    onSuccess,
    onRetry 
}: Props) {
    const [status, setStatus] = useState<'pending' | 'processing' | 'completed' | 'failed'>('pending');
    const [message, setMessage] = useState('Waiting for M-Pesa payment...');
    const [attempts, setAttempts] = useState(0);
    const [phoneNumber, setPhoneNumber] = useState(payment.phone_number || '');
    const [showRetry, setShowRetry] = useState(false);

    useEffect(() => {
        if (!isOpen) return;

        let pollInterval: NodeJS.Timeout;
        let timeout: NodeJS.Timeout;

        const checkStatus = async () => {
            try {
                const response = await fetch(`/payment/${payment.id}/status`);
                const data = await response.json();

                if (data.status === 'completed') {
                    setStatus('completed');
                    setMessage('Payment successful! Redirecting...');
                    clearInterval(pollInterval);
                    clearTimeout(timeout);
                    
                    // Redirect to order page after success
                    setTimeout(() => {
                        onSuccess();
                        router.visit(`/orders/${order.order_number}`);
                    }, 2000);
                } else if (data.status === 'failed') {
                    setStatus('failed');
                    setMessage('Payment failed. Would you like to try again?');
                    setShowRetry(true);
                    clearInterval(pollInterval);
                    clearTimeout(timeout);
                } else {
                    setMessage('Please check your phone and enter your M-Pesa PIN to complete payment.');
                }
            } catch (error) {
                console.error('Error checking payment status:', error);
            }
        };

        // Poll every 3 seconds
        pollInterval = setInterval(checkStatus, 3000);

        // Timeout after 2 minutes
        timeout = setTimeout(() => {
            if (status === 'pending' || status === 'processing') {
                setStatus('failed');
                setMessage('Payment timeout. Please try again.');
                setShowRetry(true);
                clearInterval(pollInterval);
            }
        }, 120000);

        // Initial check
        checkStatus();

        return () => {
            clearInterval(pollInterval);
            clearTimeout(timeout);
        };
    }, [isOpen, payment.id, order.order_number]);

    const handleRetry = () => {
        setShowRetry(false);
        setStatus('pending');
        setMessage('Retrying payment...');
        onRetry(phoneNumber);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
                <div className="text-center">
                    {/* Status Icon */}
                    <div className="mb-4">
                        {status === 'completed' && (
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        )}
                        {status === 'failed' && (
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                        )}
                        {(status === 'pending' || status === 'processing') && (
                            <div className="w-16 h-16 bg-[#5c2e2e] bg-opacity-10 rounded-full flex items-center justify-center mx-auto">
                                <div className="w-8 h-8 border-4 border-[#5c2e2e] border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        )}
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-bold mb-2" style={{ color: '#4a1f1f' }}>
                        {status === 'completed' ? 'Payment Successful' : 
                         status === 'failed' ? 'Payment Failed' : 
                         'Processing Payment'}
                    </h2>

                    {/* Message */}
                    <p className="text-gray-600 mb-6">{message}</p>

                    {/* Order Details */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                        <p className="text-sm text-gray-600 mb-2">Order: #{order.order_number}</p>
                        <p className="text-sm text-gray-600 mb-2">Amount: KES {order.total.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">Phone: {payment.phone_number}</p>
                    </div>

                    {/* Retry Form */}
                    {showRetry && (
                        <div className="mb-4">
                            <label className="block text-sm font-semibold mb-2 text-left" style={{ color: '#4a1f1f' }}>
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                placeholder="0712345678"
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-opacity-50 mb-4"
                            />
                            <div className="flex gap-2">
                                <button
                                    onClick={handleRetry}
                                    className="flex-1 px-4 py-2 text-white font-semibold rounded hover:opacity-90"
                                    style={{ backgroundColor: '#5c2e2e' }}
                                >
                                    Try Again
                                </button>
                                <button
                                    onClick={onClose}
                                    className="flex-1 px-4 py-2 border border-gray-300 font-semibold rounded hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Close Button for Completed/Failed without retry */}
                    {!showRetry && status !== 'pending' && status !== 'processing' && (
                        <button
                            onClick={onClose}
                            className="w-full px-4 py-2 text-white font-semibold rounded hover:opacity-90"
                            style={{ backgroundColor: '#5c2e2e' }}
                        >
                            {status === 'completed' ? 'View Order' : 'Close'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
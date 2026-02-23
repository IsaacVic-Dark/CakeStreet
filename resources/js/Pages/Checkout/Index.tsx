import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { CartItem } from '@/types';
import PaymentModal from '@/Components/PaymentModal';
import { useState } from 'react';
import { router } from '@inertiajs/react';

interface Props {
    cartItems: CartItem[];
    subtotal: number;
}

interface PaymentResponse {
    order: any;
    payment: any;
    checkout_request_id: string;
}

export default function Checkout({ cartItems, subtotal }: Props) {
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentData, setPaymentData] = useState<PaymentResponse | null>(null);

    const { data, setData, post, processing, errors } = useForm({
        delivery_type: 'delivery' as 'delivery' | 'pickup',
        delivery_address: '',
        delivery_city: '',
        delivery_date: '',
        delivery_time_slot: '10:00 - 12:00',
        payment_method: 'cash' as 'mpesa' | 'stripe' | 'paypal' | 'airtel_money' | 'cash',
        phone_number: '',
        special_instructions: '',
    });

    const tax = subtotal * 0.16;
    const deliveryFee = data.delivery_type === 'delivery' ? 500 : 0;
    const total = subtotal + tax + deliveryFee;

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate phone number for M-Pesa
        if (data.payment_method === 'mpesa' && data.delivery_type === 'delivery') {
            if (!data.phone_number) {
                alert('Please enter your M-Pesa phone number');
                return;
            }
            // Basic phone validation
            const phone = data.phone_number.replace(/\D/g, '');
            if (!phone.match(/^(0|254)?[17]\d{8}$/)) {
                alert('Please enter a valid Kenyan phone number');
                return;
            }
        }

        post('/checkout', {
            onSuccess: (page: any) => {
                // Check if we need to show payment modal (for M-Pesa)
                if (data.payment_method === 'mpesa' && data.delivery_type === 'delivery') {
                    const response = page.props as any;
                    if (response.order && response.payment) {
                        setPaymentData({
                            order: response.order,
                            payment: response.payment,
                            checkout_request_id: response.checkout_request_id
                        });
                        setShowPaymentModal(true);
                    }
                } else {
                    // For other payment methods, redirect to order page
                    router.visit(`/orders/${page.props.order?.order_number}`);
                }
            },
            onError: (errors) => {
                console.error('Checkout errors:', errors);
            }
        });
    };

    const handlePaymentRetry = (phoneNumber: string) => {
        if (paymentData) {
            router.post(`/payment/${paymentData.payment.id}/retry`, {
                phone_number: phoneNumber
            }, {
                onSuccess: (page: any) => {
                    setPaymentData({
                        order: page.props.order,
                        payment: page.props.payment,
                        checkout_request_id: page.props.checkout_request_id
                    });
                }
            });
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Checkout" />
            
            {/* Payment Modal */}
            {paymentData && (
                <PaymentModal
                    order={paymentData.order}
                    payment={paymentData.payment}
                    checkout_request_id={paymentData.checkout_request_id}
                    isOpen={showPaymentModal}
                    onClose={() => setShowPaymentModal(false)}
                    onSuccess={() => {
                        setShowPaymentModal(false);
                    }}
                    onRetry={handlePaymentRetry}
                />
            )}

            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <div className="mb-6 text-sm text-gray-600">
                    <Link href="/" className="hover:text-gray-900">Home</Link>
                    <span className="mx-2">›</span>
                    <Link href="/products" className="hover:text-gray-900">Categories</Link>
                    <span className="mx-2">›</span>
                    <span style={{ color: '#4a1f1f', fontWeight: '500' }}>CheckOut</span>
                </div>

                <h1 className="text-3xl font-bold mb-8" style={{ color: '#4a1f1f' }}>
                    Billing Details
                </h1>

                <form onSubmit={submit}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Billing Form */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Personal Information */}
                            <div className="bg-white rounded-lg shadow p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-2" style={{ color: '#4a1f1f' }}>
                                        Full Name*
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-opacity-50"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-2" style={{ color: '#4a1f1f' }}>
                                        Street Address*
                                    </label>
                                    <input
                                        type="text"
                                        value={data.delivery_address}
                                        onChange={(e) => setData('delivery_address', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-opacity-50"
                                        required={data.delivery_type === 'delivery'}
                                    />
                                    {errors.delivery_address && (
                                        <p className="text-red-600 text-sm mt-1">{errors.delivery_address}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-2" style={{ color: '#4a1f1f' }}>
                                        Apartment, floor, etc. (optional)
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-opacity-50"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-2" style={{ color: '#4a1f1f' }}>
                                        Town/City*
                                    </label>
                                    <input
                                        type="text"
                                        value={data.delivery_city}
                                        onChange={(e) => setData('delivery_city', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-opacity-50"
                                    />
                                </div>

                                {/* Phone Number Field - Show for M-Pesa */}
                                {data.payment_method === 'mpesa' && (
                                    <div>
                                        <label className="block text-sm font-semibold mb-2" style={{ color: '#4a1f1f' }}>
                                            M-Pesa Phone Number*
                                        </label>
                                        <input
                                            type="tel"
                                            value={data.phone_number}
                                            onChange={(e) => setData('phone_number', e.target.value)}
                                            placeholder="0712345678"
                                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-opacity-50"
                                            required={data.payment_method === 'mpesa' && data.delivery_type === 'delivery'}
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Enter the M-Pesa registered phone number
                                        </p>
                                        {errors.phone_number && (
                                            <p className="text-red-600 text-sm mt-1">{errors.phone_number}</p>
                                        )}
                                    </div>
                                )}

                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="save-info"
                                        className="w-4 h-4"
                                        style={{ accentColor: '#5c2e2e' }}
                                    />
                                    <label htmlFor="save-info" className="text-sm text-gray-700">
                                        Save this information for faster check-out next time
                                    </label>
                                </div>
                            </div>

                            {/* Delivery Options - same as before */}
                            <div className="bg-white rounded-lg shadow p-6">
                                <h2 className="text-lg font-semibold mb-4" style={{ color: '#4a1f1f' }}>
                                    Delivery Options
                                </h2>
                                <div className="space-y-3">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="delivery_type"
                                            value="delivery"
                                            checked={data.delivery_type === 'delivery'}
                                            onChange={() => setData('delivery_type', 'delivery')}
                                            className="w-4 h-4"
                                            style={{ accentColor: '#5c2e2e' }}
                                        />
                                        <span className="font-medium">Delivery</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="delivery_type"
                                            value="pickup"
                                            checked={data.delivery_type === 'pickup'}
                                            onChange={() => setData('delivery_type', 'pickup')}
                                            className="w-4 h-4"
                                            style={{ accentColor: '#5c2e2e' }}
                                        />
                                        <span className="font-medium">Pickup</span>
                                    </label>
                                </div>

                                <div className="mt-4 grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold mb-2" style={{ color: '#4a1f1f' }}>
                                            Delivery Date*
                                        </label>
                                        <input
                                            type="date"
                                            value={data.delivery_date}
                                            onChange={(e) => setData('delivery_date', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-opacity-50"
                                            required
                                        />
                                        {errors.delivery_date && (
                                            <p className="text-red-600 text-sm mt-1">{errors.delivery_date}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-2" style={{ color: '#4a1f1f' }}>
                                            Time Slot*
                                        </label>
                                        <select
                                            value={data.delivery_time_slot}
                                            onChange={(e) => setData('delivery_time_slot', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-opacity-50"
                                        >
                                            <option value="10:00 - 12:00">10:00 - 12:00</option>
                                            <option value="12:00 - 14:00">12:00 - 14:00</option>
                                            <option value="14:00 - 16:00">14:00 - 16:00</option>
                                            <option value="16:00 - 18:00">16:00 - 18:00</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Special Instructions */}
                            <div className="bg-white rounded-lg shadow p-6">
                                <label className="block text-sm font-semibold mb-2" style={{ color: '#4a1f1f' }}>
                                    Special Instructions (optional)
                                </label>
                                <textarea
                                    value={data.special_instructions}
                                    onChange={(e) => setData('special_instructions', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-opacity-50"
                                    rows={3}
                                    placeholder="Any special requests for your order?"
                                />
                            </div>
                        </div>

                        {/* Right Column - Order Summary & Payment */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow p-6 sticky top-4 space-y-6">
                                {/* Order Items */}
                                <div>
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="flex items-center gap-3 mb-4">
                                            <img
                                                src={item.product?.image_urls?.[0] ?? '/images/placeholder-cake.jpg'}
                                                alt={item.product?.name}
                                                className="w-16 h-16 object-cover rounded"
                                            />
                                            <div className="flex-1">
                                                <p className="font-medium text-sm" style={{ color: '#4a1f1f' }}>
                                                    {item.product?.name}
                                                </p>
                                                <p className="text-xs text-gray-600">
                                                    Qty: {item.quantity}
                                                </p>
                                            </div>
                                            <p className="font-semibold text-sm" style={{ color: '#4a1f1f' }}>
                                                KES {((item.customization?.size?.price ?? item.product?.base_price ?? 0) * item.quantity).toLocaleString()}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                {/* Price Summary */}
                                <div className="space-y-2 pt-4 border-t border-gray-200">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Subtotal:</span>
                                        <span className="font-semibold" style={{ color: '#4a1f1f' }}>
                                            KES {subtotal.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Shipping:</span>
                                        <span className="font-semibold" style={{ color: '#4a1f1f' }}>
                                            {data.delivery_type === 'delivery' ? `KES ${deliveryFee.toLocaleString()}` : 'Free'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm pb-2 border-b border-gray-200">
                                        <span className="text-gray-600">Tax (16%):</span>
                                        <span className="font-semibold" style={{ color: '#4a1f1f' }}>
                                            KES {tax.toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                {/* Coupon Code */}
                                <div>
                                    <label className="block text-sm font-semibold mb-2" style={{ color: '#4a1f1f' }}>
                                        Coupon Code
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Enter code"
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-opacity-50"
                                        />
                                        <button
                                            type="button"
                                            className="px-4 py-2 text-white text-sm font-semibold rounded hover:opacity-90"
                                            style={{ backgroundColor: '#5c2e2e' }}
                                        >
                                            Apply Coupon
                                        </button>
                                    </div>
                                </div>

                                {/* Total */}
                                <div className="flex justify-between text-lg font-bold pt-2">
                                    <span style={{ color: '#4a1f1f' }}>Total:</span>
                                    <span style={{ color: '#4a1f1f' }}>KES {total.toLocaleString()}</span>
                                </div>

                                {/* Payment Methods */}
                                <div>
                                    <h3 className="text-sm font-semibold mb-3" style={{ color: '#4a1f1f' }}>
                                        Payment Method
                                    </h3>
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="payment_method"
                                                value="cash"
                                                checked={data.payment_method === 'cash'}
                                                onChange={() => setData('payment_method', 'cash')}
                                                className="w-4 h-4"
                                                style={{ accentColor: '#5c2e2e' }}
                                            />
                                            <span className="text-sm font-medium">Cash on delivery/pickup</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="payment_method"
                                                value="mpesa"
                                                checked={data.payment_method === 'mpesa'}
                                                onChange={() => setData('payment_method', 'mpesa')}
                                                className="w-4 h-4"
                                                style={{ accentColor: '#5c2e2e' }}
                                            />
                                            <span className="text-sm font-medium">M-Pesa</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="payment_method"
                                                value="stripe"
                                                checked={data.payment_method === 'stripe'}
                                                onChange={() => setData('payment_method', 'stripe')}
                                                className="w-4 h-4"
                                                style={{ accentColor: '#5c2e2e' }}
                                            />
                                            <span className="text-sm font-medium">Card (Stripe)</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="payment_method"
                                                value="paypal"
                                                checked={data.payment_method === 'paypal'}
                                                onChange={() => setData('payment_method', 'paypal')}
                                                className="w-4 h-4"
                                                style={{ accentColor: '#5c2e2e' }}
                                            />
                                            <span className="text-sm font-medium">PayPal</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="payment_method"
                                                value="airtel_money"
                                                checked={data.payment_method === 'airtel_money'}
                                                onChange={() => setData('payment_method', 'airtel_money')}
                                                className="w-4 h-4"
                                                style={{ accentColor: '#5c2e2e' }}
                                            />
                                            <span className="text-sm font-medium">Airtel Money</span>
                                        </label>
                                    </div>
                                    {data.payment_method !== 'cash' && (
                                        <div className="mt-3 flex gap-2">
                                            {data.payment_method === 'stripe' && (
                                                <>
                                                    <img src="/images/payment-icons/visa.png" alt="Visa" className="h-6" />
                                                    <img src="/images/payment-icons/mastercard.png" alt="Mastercard" className="h-6" />
                                                </>
                                            )}
                                            {data.payment_method === 'mpesa' && (
                                                <img src="/images/payment-icons/mpesa.png" alt="M-Pesa" className="h-6" />
                                            )}
                                            {data.payment_method === 'paypal' && (
                                                <img src="/images/payment-icons/paypal.png" alt="PayPal" className="h-6" />
                                            )}
                                            {data.payment_method === 'airtel_money' && (
                                                <img src="/images/payment-icons/airtel.png" alt="Airtel Money" className="h-6" />
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Important Notice for M-Pesa Pickup */}
                                {data.payment_method === 'mpesa' && data.delivery_type === 'pickup' && (
                                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                                        <p className="text-sm text-yellow-700">
                                            For pickup orders, you'll pay at the bakery. No M-Pesa STK push will be sent.
                                        </p>
                                    </div>
                                )}

                                {/* Place Order Button */}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full px-6 py-3 text-white font-semibold rounded hover:opacity-90 transition-opacity disabled:opacity-50"
                                    style={{ backgroundColor: '#5c2e2e' }}
                                >
                                    {processing ? 'Processing...' : 'Place Order'}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
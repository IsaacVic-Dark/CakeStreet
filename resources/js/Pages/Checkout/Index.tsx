import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { CartItem } from '@/types';

interface Props {
    cartItems: CartItem[];
    subtotal: number;
}

export default function Checkout({ cartItems, subtotal }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        delivery_type: 'delivery' as 'delivery' | 'pickup',
        delivery_address: '',
        delivery_city: '',
        delivery_date: '',
        delivery_time_slot: '10:00 - 12:00',
        payment_method: 'cash' as 'mpesa' | 'stripe' | 'cash',
        special_instructions: '',
    });

    const tax = subtotal * 0.16;
    const deliveryFee = data.delivery_type === 'delivery' ? 500 : 0;
    const total = subtotal + tax + deliveryFee;

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/checkout');
    };

    return (
        <AuthenticatedLayout>
            <Head title="Checkout" />
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-black uppercase mb-8 border-b-4 border-black pb-4">
                    Checkout
                </h1>

                <form onSubmit={submit} className="space-y-6">
                    <div className="bg-white border-4 border-black p-6">
                        <h2 className="text-xl font-black uppercase mb-4">Delivery</h2>
                        <div className="flex gap-4 mb-4">
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="delivery_type"
                                    value="delivery"
                                    checked={data.delivery_type === 'delivery'}
                                    onChange={() => setData('delivery_type', 'delivery')}
                                />
                                Delivery
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="delivery_type"
                                    value="pickup"
                                    checked={data.delivery_type === 'pickup'}
                                    onChange={() => setData('delivery_type', 'pickup')}
                                />
                                Pickup
                            </label>
                        </div>
                        {data.delivery_type === 'delivery' && (
                            <>
                                <div className="mb-4">
                                    <label className="block font-bold mb-2">Address</label>
                                    <textarea
                                        value={data.delivery_address}
                                        onChange={(e) => setData('delivery_address', e.target.value)}
                                        className="w-full border-4 border-black p-2"
                                        rows={3}
                                        required={data.delivery_type === 'delivery'}
                                    />
                                    {errors.delivery_address && (
                                        <p className="text-red-600 text-sm mt-1">{errors.delivery_address}</p>
                                    )}
                                </div>
                                <div className="mb-4">
                                    <label className="block font-bold mb-2">City</label>
                                    <input
                                        type="text"
                                        value={data.delivery_city}
                                        onChange={(e) => setData('delivery_city', e.target.value)}
                                        className="w-full border-4 border-black p-2"
                                    />
                                </div>
                            </>
                        )}
                        <div className="mb-4">
                            <label className="block font-bold mb-2">Delivery date</label>
                            <input
                                type="date"
                                value={data.delivery_date}
                                onChange={(e) => setData('delivery_date', e.target.value)}
                                className="border-4 border-black p-2"
                                required
                            />
                            {errors.delivery_date && (
                                <p className="text-red-600 text-sm mt-1">{errors.delivery_date}</p>
                            )}
                        </div>
                        <div className="mb-4">
                            <label className="block font-bold mb-2">Time slot</label>
                            <select
                                value={data.delivery_time_slot}
                                onChange={(e) => setData('delivery_time_slot', e.target.value)}
                                className="border-4 border-black p-2"
                            >
                                <option value="10:00 - 12:00">10:00 - 12:00</option>
                                <option value="12:00 - 14:00">12:00 - 14:00</option>
                                <option value="14:00 - 16:00">14:00 - 16:00</option>
                                <option value="16:00 - 18:00">16:00 - 18:00</option>
                            </select>
                        </div>
                    </div>

                    <div className="bg-white border-4 border-black p-6">
                        <h2 className="text-xl font-black uppercase mb-4">Payment</h2>
                        <div className="space-y-2">
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="payment_method"
                                    value="cash"
                                    checked={data.payment_method === 'cash'}
                                    onChange={() => setData('payment_method', 'cash')}
                                />
                                Cash on delivery
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="payment_method"
                                    value="mpesa"
                                    checked={data.payment_method === 'mpesa'}
                                    onChange={() => setData('payment_method', 'mpesa')}
                                />
                                M-Pesa
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="payment_method"
                                    value="stripe"
                                    checked={data.payment_method === 'stripe'}
                                    onChange={() => setData('payment_method', 'stripe')}
                                />
                                Card (Stripe)
                            </label>
                        </div>
                    </div>

                    <div className="bg-white border-4 border-black p-6">
                        <label className="block font-bold mb-2">Special instructions</label>
                        <textarea
                            value={data.special_instructions}
                            onChange={(e) => setData('special_instructions', e.target.value)}
                            className="w-full border-4 border-black p-2"
                            rows={2}
                        />
                    </div>

                    <div className="bg-white border-4 border-black p-6">
                        <div className="flex justify-between font-bold mb-2">
                            <span>Subtotal</span>
                            <span>KES {subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between font-bold mb-2">
                            <span>Tax</span>
                            <span>KES {tax.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between font-bold mb-2">
                            <span>Delivery</span>
                            <span>KES {deliveryFee.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-xl font-black border-t-4 border-black pt-4 mt-4">
                            <span>Total</span>
                            <span>KES {total.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <Link
                            href="/cart"
                            className="px-6 py-4 bg-white border-4 border-black font-bold uppercase"
                        >
                            Back to cart
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-8 py-4 bg-black text-white font-black uppercase border-4 border-black shadow-[4px_4px_0_0_#000] disabled:opacity-50"
                        >
                            {processing ? 'Processing...' : 'Place order'}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}

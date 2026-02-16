import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { CartItem as CartItemType } from '@/types';
import { Trash2, Plus, Minus } from 'lucide-react';

interface Props {
    cartItems: CartItemType[];
    subtotal: number;
}

export default function Cart({ cartItems, subtotal }: Props) {
    const updateQuantity = (itemId: string, newQuantity: number) => {
        if (newQuantity < 1) return;
        router.patch(`/cart/${itemId}`, { quantity: newQuantity }, { preserveScroll: true });
    };

    const removeItem = (itemId: string) => {
        if (confirm('Remove this item from cart?')) {
            router.delete(`/cart/${itemId}`, { preserveScroll: true });
        }
    };

    const tax = subtotal * 0.16;
    const deliveryFee = 500;
    const total = subtotal + tax + deliveryFee;

    return (
        <AuthenticatedLayout>
            <Head title="Cart" />
            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8" style={{ color: '#4a1f1f' }}>
                    Add to Cart
                </h1>

                {cartItems.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-lg shadow">
                        <p className="text-2xl font-semibold mb-4" style={{ color: '#4a1f1f' }}>
                            Your cart is empty
                        </p>
                        <Link
                            href="/products"
                            className="inline-block px-8 py-3 text-white font-semibold rounded"
                            style={{ backgroundColor: '#5c2e2e' }}
                        >
                            Browse Cakes
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {cartItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-white rounded-lg shadow p-4 flex items-center gap-4"
                                >
                                    <img
                                        src={item.product?.image_urls?.[0] ?? '/images/placeholder-cake.jpg'}
                                        alt={item.product?.name}
                                        className="w-24 h-24 object-cover rounded"
                                    />
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-lg mb-1" style={{ color: '#4a1f1f' }}>
                                            {item.product?.name}
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-2">
                                            {item.customization?.size && (
                                                <span>
                                                    {item.customization.size.kg}kg
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        {/* Quantity Controls */}
                                        <div className="flex items-center rounded overflow-hidden" style={{ border: '1px solid #5c2e2e' }}>
                                            <button
                                                type="button"
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="px-3 py-1 text-white hover:opacity-80"
                                                style={{ backgroundColor: '#5c2e2e' }}
                                            >
                                                <Minus size={16} />
                                            </button>
                                            <span className="px-4 py-1 font-semibold" style={{ color: '#4a1f1f' }}>
                                                {item.quantity}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="px-3 py-1 text-white hover:opacity-80"
                                                style={{ backgroundColor: '#5c2e2e' }}
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>
                                        {/* Price */}
                                        <div className="text-right min-w-[100px]">
                                            <p className="font-semibold" style={{ color: '#4a1f1f' }}>
                                                KES {(item.customization?.size?.price ?? item.product?.base_price ?? 0).toLocaleString()}
                                            </p>
                                        </div>
                                        {/* Remove Button */}
                                        <button
                                            type="button"
                                            onClick={() => removeItem(item.id)}
                                            className="text-gray-400 hover:text-red-500"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
                                <h2 className="text-xl font-semibold mb-6" style={{ color: '#4a1f1f' }}>
                                    Order Summary
                                </h2>
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="font-semibold" style={{ color: '#4a1f1f' }}>
                                            KES {subtotal.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Tax</span>
                                        <span className="font-semibold" style={{ color: '#4a1f1f' }}>
                                            KES {tax.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm pb-3" style={{ borderBottom: '1px solid #e5e7eb' }}>
                                        <span className="text-gray-600">Delivery</span>
                                        <span className="font-semibold" style={{ color: '#4a1f1f' }}>
                                            KES {deliveryFee.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-lg font-bold pt-2">
                                        <span style={{ color: '#4a1f1f' }}>Total</span>
                                        <span style={{ color: '#4a1f1f' }}>KES {total.toLocaleString()}</span>
                                    </div>
                                </div>
                                <Link
                                    href="/checkout"
                                    className="block w-full px-6 py-3 text-white text-center font-semibold rounded hover:opacity-90 transition-opacity"
                                    style={{ backgroundColor: '#5c2e2e' }}
                                >
                                    Proceed to Checkout
                                </Link>
                                <Link
                                    href="/products"
                                    className="block w-full px-6 py-3 text-center font-semibold rounded mt-3 hover:bg-gray-50 transition-colors"
                                    style={{ color: '#5c2e2e', border: '1px solid #5c2e2e' }}
                                >
                                    Continue Shopping
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
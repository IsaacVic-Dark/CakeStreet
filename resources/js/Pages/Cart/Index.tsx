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
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-black uppercase mb-8 border-b-4 border-black pb-4">
                    Your Cart
                </h1>

                {cartItems.length === 0 ? (
                    <div className="text-center py-16 bg-white border-4 border-black">
                        <p className="text-2xl font-bold mb-4">Your cart is empty</p>
                        <Link
                            href="/products"
                            className="inline-block px-8 py-4 bg-amber-400 border-4 border-black font-black uppercase shadow-[4px_4px_0_0_#000]"
                        >
                            Browse Cakes
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-4">
                            {cartItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-white border-4 border-black p-6 flex flex-col sm:flex-row gap-6"
                                >
                                    <img
                                        src={item.product?.image_urls?.[0] ?? '/images/placeholder-cake.jpg'}
                                        alt={item.product?.name}
                                        className="w-32 h-32 object-cover border-4 border-black shrink-0"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-xl font-black uppercase mb-2">
                                            {item.product?.name}
                                        </h3>
                                        {item.customization?.size && (
                                            <p className="text-sm font-bold mb-2">
                                                Size: {item.customization.size.kg}kg (Serves {item.customization.size.serves})
                                            </p>
                                        )}
                                        <p className="text-lg font-bold">
                                            KES {(item.customization?.size?.price ?? item.product?.base_price ?? 0).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between gap-2">
                                        <button
                                            type="button"
                                            onClick={() => removeItem(item.id)}
                                            className="p-2 border-4 border-black hover:bg-red-100"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                        <div className="flex items-center border-4 border-black">
                                            <button
                                                type="button"
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="p-2 border-r-4 border-black hover:bg-gray-100"
                                            >
                                                <Minus size={16} />
                                            </button>
                                            <span className="px-4 font-bold">{item.quantity}</span>
                                            <button
                                                type="button"
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="p-2 border-l-4 border-black hover:bg-gray-100"
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="bg-white border-4 border-black p-6 h-fit lg:sticky lg:top-4">
                            <h2 className="text-2xl font-black uppercase mb-6 border-b-4 border-black pb-4">
                                Order Summary
                            </h2>
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between font-bold">
                                    <span>Subtotal:</span>
                                    <span>KES {subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between font-bold">
                                    <span>Tax (16%):</span>
                                    <span>KES {tax.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between font-bold">
                                    <span>Delivery:</span>
                                    <span>KES {deliveryFee.toLocaleString()}</span>
                                </div>
                                <div className="border-t-4 border-black pt-3 flex justify-between text-xl font-black">
                                    <span>TOTAL:</span>
                                    <span>KES {total.toLocaleString()}</span>
                                </div>
                            </div>
                            <Link
                                href="/checkout"
                                className="block w-full px-6 py-4 bg-black text-white text-center font-black uppercase border-4 border-black shadow-[4px_4px_0_0_#000] hover:shadow-[2px_2px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                            >
                                Proceed to Checkout
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}

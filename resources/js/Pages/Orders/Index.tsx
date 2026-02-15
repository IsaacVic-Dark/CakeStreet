import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Order } from '@/types';

interface PaginatedOrders {
    data: Order[];
    current_page: number;
    last_page: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    orders: PaginatedOrders;
}

export default function OrdersIndex({ orders }: Props) {
    return (
        <AuthenticatedLayout>
            <Head title="My Orders" />
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-black uppercase mb-8 border-b-4 border-black pb-4">
                    My Orders
                </h1>
                {orders.data.length === 0 ? (
                    <div className="bg-white border-4 border-black p-8 text-center">
                        <p className="text-xl font-bold">No orders yet.</p>
                        <Link href="/products" className="inline-block mt-4 px-6 py-3 bg-amber-400 border-4 border-black font-bold">
                            Browse cakes
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.data.map((order) => (
                            <Link
                                key={order.id}
                                href={`/my-orders/${order.id}`}
                                className="block bg-white border-4 border-black p-6 hover:shadow-[8px_8px_0_0_#000] transition-all"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-black text-lg">{order.order_number}</p>
                                        <p className="text-gray-600 text-sm">{new Date(order.created_at).toLocaleDateString()}</p>
                                        <p className="font-bold mt-2">KES {Number(order.total).toLocaleString()}</p>
                                    </div>
                                    <span className="px-4 py-2 border-4 border-black font-bold bg-amber-200">
                                        {order.status}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
                {orders.last_page > 1 && (
                    <div className="flex justify-center gap-2 mt-8">
                        {orders.links.map((link, i) => (
                            link.url ? (
                                <Link key={i} href={link.url} className="px-4 py-2 border-4 border-black font-bold">
                                    {link.label.replace('&laquo;', '').replace('&raquo;', '').trim() || (i === 0 ? 'Prev' : 'Next')}
                                </Link>
                            ) : null
                        ))}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}

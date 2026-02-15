import OwnerLayout from '@/Layouts/OwnerLayout';
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

export default function OwnerOrdersIndex({ orders }: Props) {
    return (
        <OwnerLayout>
            <Head title="Orders" />
            <h1 className="text-3xl font-black uppercase mb-8 border-b-4 border-black pb-4">Orders</h1>
            {orders.data.length === 0 ? (
                <div className="bg-white border-4 border-black p-8 text-center">
                    <p className="text-xl font-bold">No orders yet.</p>
                </div>
            ) : (
                <div className="bg-white border-4 border-black overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b-4 border-black bg-gray-100">
                                <th className="text-left p-4 font-black">Order</th>
                                <th className="text-left p-4 font-black">Date</th>
                                <th className="text-left p-4 font-black">Total</th>
                                <th className="text-left p-4 font-black">Status</th>
                                <th className="text-left p-4 font-black">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.data.map((order) => (
                                <tr key={order.id} className="border-b-2 border-gray-200">
                                    <td className="p-4 font-bold">{order.order_number}</td>
                                    <td className="p-4">{new Date(order.created_at).toLocaleDateString()}</td>
                                    <td className="p-4">KES {Number(order.total).toLocaleString()}</td>
                                    <td className="p-4">{order.status}</td>
                                    <td className="p-4">
                                        <Link href={"/owner/orders/" + order.id} className="font-bold underline">View</Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </OwnerLayout>
    );
}

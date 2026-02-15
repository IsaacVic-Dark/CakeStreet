import OwnerLayout from '@/Layouts/OwnerLayout';
import { Head, Link } from '@inertiajs/react';
import { Bakery, Order } from '@/types';

interface Props {
    bakery: Bakery;
    stats: { totalOrders: number; pendingOrders: number; totalRevenue: number; totalProducts: number };
    recentOrders: Order[];
    salesData: { date: string; total: number }[];
}

export default function OwnerDashboard(props: Props) {
    const { bakery, stats, recentOrders, salesData } = props;

    return (
        <OwnerLayout>
            <Head title="Owner Dashboard" />
            <h1 className="text-3xl font-black uppercase mb-8 border-b-4 border-black pb-4">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0_0_#000]">
                    <p className="text-gray-600 font-bold">Total Orders</p>
                    <p className="text-3xl font-black">{stats.totalOrders}</p>
                </div>
                <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0_0_#000]">
                    <p className="text-gray-600 font-bold">Pending</p>
                    <p className="text-3xl font-black">{stats.pendingOrders}</p>
                </div>
                <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0_0_#000]">
                    <p className="text-gray-600 font-bold">Revenue (KES)</p>
                    <p className="text-3xl font-black">{stats.totalRevenue.toLocaleString()}</p>
                </div>
                <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0_0_#000]">
                    <p className="text-gray-600 font-bold">Products</p>
                    <p className="text-3xl font-black">{stats.totalProducts}</p>
                </div>
            </div>
            <div className="bg-white border-4 border-black p-6">
                <h2 className="text-xl font-black uppercase mb-4">Recent Orders</h2>
                {recentOrders.length === 0 ? (
                    <p className="text-gray-600">No orders yet.</p>
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr className="border-b-4 border-black">
                                <th className="text-left py-2 font-black">Order</th>
                                <th className="text-left py-2 font-black">Total</th>
                                <th className="text-left py-2 font-black">Status</th>
                                <th className="text-left py-2 font-black">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.map((order) => (
                                <tr key={order.id} className="border-b-2 border-gray-200">
                                    <td className="py-2">{order.order_number}</td>
                                    <td className="py-2 font-bold">KES {Number(order.total).toLocaleString()}</td>
                                    <td className="py-2">{order.status}</td>
                                    <td className="py-2">
                                        <Link href={"/owner/orders/" + order.id} className="font-bold underline">View</Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </OwnerLayout>
    );
}

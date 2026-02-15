import OwnerLayout from '@/Layouts/OwnerLayout';
import { Head, useForm } from '@inertiajs/react';
import { Order } from '@/types';

interface Props {
    order: Order;
}

const STATUS_OPTIONS = ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'];

export default function OwnerOrdersShow({ order }: Props) {
    const { data, setData, patch, processing } = useForm({ status: order.status });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        patch('/owner/orders/' + order.id + '/status');
    };

    return (
        <OwnerLayout>
            <Head title={"Order " + order.order_number} />
            <h1 className="text-3xl font-black uppercase mb-8 border-b-4 border-black pb-4">Order {order.order_number}</h1>
            <div className="space-y-6">
                <div className="bg-white border-4 border-black p-6">
                    <p><span className="font-bold">Customer ID:</span> {order.customer_id}</p>
                    <p><span className="font-bold">Date:</span> {new Date(order.created_at).toLocaleString()}</p>
                    <p><span className="font-bold">Delivery:</span> {order.delivery_type}</p>
                    {order.delivery_address && <p><span className="font-bold">Address:</span> {order.delivery_address}</p>}
                    <p><span className="font-bold">Total:</span> KES {Number(order.total).toLocaleString()}</p>
                </div>
                <form onSubmit={submit} className="bg-white border-4 border-black p-6">
                    <label className="block font-bold mb-2">Update status</label>
                    <div className="flex gap-4 items-end">
                        <select value={data.status} onChange={(e) => setData('status', e.target.value)} className="border-4 border-black p-2">
                            {STATUS_OPTIONS.map((s) => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                        <button type="submit" disabled={processing} className="px-6 py-2 bg-black text-white font-bold border-4 border-black">
                            {processing ? 'Saving...' : 'Update'}
                        </button>
                    </div>
                </form>
                <div className="bg-white border-4 border-black p-6">
                    <h2 className="text-xl font-black uppercase mb-4">Items</h2>
                    <ul className="space-y-2">
                        {order.items?.map((item) => (
                            <li key={item.id} className="flex justify-between border-b border-gray-200 pb-2">
                                <span>{item.product_name} x {item.quantity}</span>
                                <span className="font-bold">KES {Number(item.total_price).toLocaleString()}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </OwnerLayout>
    );
}

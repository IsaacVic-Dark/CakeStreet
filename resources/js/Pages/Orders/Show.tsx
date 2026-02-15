import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Order } from '@/types';

interface Props {
    order: Order;
}

export default function OrderShow({ order }: Props) {
    return (
        <AuthenticatedLayout>
            <Head title={`Order ${order.order_number}`} />
            <div className="max-w-4xl mx-auto">
                <Link href="/my-orders" className="font-bold uppercase hover:underline mb-6 inline-block">
                    Back to orders
                </Link>
                <h1 className="text-4xl font-black uppercase mb-8 border-b-4 border-black pb-4">
                    Order {order.order_number}
                </h1>

                <div className="bg-white border-4 border-black p-6 mb-6">
                    <div className="flex flex-wrap gap-4 justify-between mb-4">
                        <p><span className="font-bold">Date:</span> {new Date(order.created_at).toLocaleString()}</p>
                        <p><span className="font-bold">Status:</span> {order.status}</p>
                        <p><span className="font-bold">Payment:</span> {order.payment_status}</p>
                    </div>
                    <div className="border-t-4 border-black pt-4">
                        <p><span className="font-bold">Delivery:</span> {order.delivery_type}</p>
                        {order.delivery_address && <p><span className="font-bold">Address:</span> {order.delivery_address}</p>}
                        {order.delivery_date && <p><span className="font-bold">Date:</span> {order.delivery_date}</p>}
                        {order.delivery_time_slot && <p><span className="font-bold">Time:</span> {order.delivery_time_slot}</p>}
                    </div>
                </div>

                <div className="bg-white border-4 border-black p-6 mb-6">
                    <h2 className="text-xl font-black uppercase mb-4">Items</h2>
                    <ul className="space-y-3">
                        {order.items?.map((item) => (
                            <li key={item.id} className="flex justify-between border-b-2 border-gray-200 pb-2">
                                <span>{item.product_name} x {item.quantity}</span>
                                <span className="font-bold">KES {Number(item.total_price).toLocaleString()}</span>
                            </li>
                        ))}
                    </ul>
                    <div className="border-t-4 border-black mt-4 pt-4 space-y-2">
                        <div className="flex justify-between font-bold">
                            <span>Subtotal</span>
                            <span>KES {Number(order.subtotal).toLocaleString()}</span>
                        </div>
                        {order.tax > 0 && (
                            <div className="flex justify-between font-bold">
                                <span>Tax</span>
                                <span>KES {Number(order.tax).toLocaleString()}</span>
                            </div>
                        )}
                        {order.delivery_fee > 0 && (
                            <div className="flex justify-between font-bold">
                                <span>Delivery</span>
                                <span>KES {Number(order.delivery_fee).toLocaleString()}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-xl font-black">
                            <span>Total</span>
                            <span>KES {Number(order.total).toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

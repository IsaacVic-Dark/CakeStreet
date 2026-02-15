import OwnerLayout from '@/Layouts/OwnerLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Product } from '@/types';

interface PaginatedProducts {
    data: Product[];
    current_page: number;
    last_page: number;
}

interface Props {
    products: PaginatedProducts;
}

export default function OwnerProductsIndex({ products }: Props) {
    const destroy = (id: string) => {
        if (confirm('Delete this product?')) router.delete('/owner/products/' + id);
    };

    return (
        <OwnerLayout>
            <Head title="Products" />
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-black uppercase border-b-4 border-black pb-4">Products</h1>
                <Link href="/owner/products/create" className="px-6 py-3 bg-black text-white font-black uppercase border-4 border-black">
                    Add product
                </Link>
            </div>
            {products.data.length === 0 ? (
                <div className="bg-white border-4 border-black p-8 text-center">
                    <p className="text-xl font-bold mb-4">No products yet.</p>
                    <Link href="/owner/products/create" className="px-6 py-3 bg-amber-400 border-4 border-black font-bold">Create first product</Link>
                </div>
            ) : (
                <div className="bg-white border-4 border-black overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b-4 border-black bg-gray-100">
                                <th className="text-left p-4 font-black">Name</th>
                                <th className="text-left p-4 font-black">Category</th>
                                <th className="text-left p-4 font-black">Price</th>
                                <th className="text-left p-4 font-black">Stock</th>
                                <th className="text-left p-4 font-black">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.data.map((product) => (
                                <tr key={product.id} className="border-b-2 border-gray-200">
                                    <td className="p-4 font-bold">{product.name}</td>
                                    <td className="p-4">{product.category}</td>
                                    <td className="p-4">KES {Number(product.base_price).toLocaleString()}</td>
                                    <td className="p-4">{product.stock_quantity}</td>
                                    <td className="p-4">
                                        <Link href={"/owner/products/" + product.id + "/edit"} className="font-bold underline mr-4">Edit</Link>
                                        <button type="button" onClick={() => destroy(product.id)} className="font-bold text-red-600 underline">Delete</button>
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

import OwnerLayout from '@/Layouts/OwnerLayout';
import { Head, useForm } from '@inertiajs/react';
import { Product } from '@/types';

interface Props {
    product: Product;
}

export default function OwnerProductsEdit({ product }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: product.name,
        description: product.description ?? '',
        category: product.category ?? 'birthday',
        base_flavor: product.base_flavor ?? '',
        available_sizes: product.available_sizes ?? [],
        base_price: String(product.base_price ?? 0),
        image_urls: product.image_urls ?? ['/images/placeholder-cake.jpg'],
        ingredients: product.ingredients ?? [],
        allergens: product.allergens ?? [],
        is_eggless: product.is_eggless ?? false,
        is_sugar_free: product.is_sugar_free ?? false,
        is_available: product.is_available ?? true,
        is_featured: product.is_featured ?? false,
        stock_quantity: String(product.stock_quantity ?? 0),
        preparation_time_hours: String(product.preparation_time_hours ?? 24),
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put('/owner/products/' + product.id);
    };

    return (
        <OwnerLayout>
            <Head title={"Edit " + product.name} />
            <h1 className="text-3xl font-black uppercase mb-8 border-b-4 border-black pb-4">Edit product</h1>
            <form onSubmit={submit} className="max-w-2xl space-y-6">
                <div>
                    <label className="block font-bold mb-2">Name *</label>
                    <input type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} className="w-full border-4 border-black p-2" required />
                    {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
                </div>
                <div>
                    <label className="block font-bold mb-2">Description</label>
                    <textarea value={data.description} onChange={(e) => setData('description', e.target.value)} className="w-full border-4 border-black p-2" rows={3} />
                </div>
                <div>
                    <label className="block font-bold mb-2">Category *</label>
                    <select value={data.category} onChange={(e) => setData('category', e.target.value)} className="w-full border-4 border-black p-2">
                        <option value="birthday">Birthday</option>
                        <option value="wedding">Wedding</option>
                        <option value="anniversary">Anniversary</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div>
                    <label className="block font-bold mb-2">Base price *</label>
                    <input type="number" value={data.base_price} onChange={(e) => setData('base_price', e.target.value)} className="w-full border-4 border-black p-2" required />
                </div>
                <div>
                    <label className="block font-bold mb-2">Image URL</label>
                    <input type="text" value={data.image_urls[0]} onChange={(e) => setData('image_urls', [e.target.value])} className="w-full border-4 border-black p-2" />
                </div>
                <div>
                    <label className="block font-bold mb-2">Stock quantity *</label>
                    <input type="number" value={data.stock_quantity} onChange={(e) => setData('stock_quantity', e.target.value)} className="w-full border-4 border-black p-2" required />
                </div>
                <div>
                    <label className="block font-bold mb-2">Preparation time (hours)</label>
                    <input type="number" value={data.preparation_time_hours} onChange={(e) => setData('preparation_time_hours', e.target.value)} className="w-full border-4 border-black p-2" />
                </div>
                <div className="flex gap-4">
                    <label className="flex items-center gap-2"><input type="checkbox" checked={data.is_available} onChange={(e) => setData('is_available', e.target.checked)} /> Available</label>
                    <label className="flex items-center gap-2"><input type="checkbox" checked={data.is_featured} onChange={(e) => setData('is_featured', e.target.checked)} /> Featured</label>
                </div>
                <button type="submit" disabled={processing} className="px-8 py-4 bg-black text-white font-black uppercase border-4 border-black">{processing ? 'Saving...' : 'Save'}</button>
            </form>
        </OwnerLayout>
    );
}

import OwnerLayout from '@/Layouts/OwnerLayout';
import { Head, useForm } from '@inertiajs/react';
import { ProductSize } from '@/types';
import { useState } from 'react';

export default function OwnerProductsCreate() {
    const [sizes, setSizes] = useState<ProductSize[]>([{ kg: 0.5, price: 1500, serves: 4 }]);
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        category: 'birthday',
        base_flavor: '',
        available_sizes: sizes,
        base_price: '2500',
        image_urls: ['/images/placeholder-cake.jpg'],
        ingredients: [] as string[],
        allergens: [] as string[],
        is_eggless: false,
        is_sugar_free: false,
        stock_quantity: '10',
        preparation_time_hours: '24',
        is_available: true,
        is_featured: false,
    });

    const addSize = () => setSizes((s) => [...s, { kg: 1, price: 2000, serves: 8 }]);
    const updateSize = (i: number, field: keyof ProductSize, value: number) => {
        setSizes((s) => {
            const n = [...s];
            n[i] = { ...n[i], [field]: value };
            return n;
        });
        setData('available_sizes', sizes.map((x, j) => (j === i ? { ...sizes[i], [field]: value } : x)));
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        setData('available_sizes', sizes);
        post('/owner/products');
    };

    return (
        <OwnerLayout>
            <Head title="Add Product" />
            <h1 className="text-3xl font-black uppercase mb-8 border-b-4 border-black pb-4">Add product</h1>
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
                    <label className="block font-bold mb-2">Base flavor</label>
                    <input type="text" value={data.base_flavor} onChange={(e) => setData('base_flavor', e.target.value)} className="w-full border-4 border-black p-2" />
                </div>
                <div>
                    <label className="block font-bold mb-2">Sizes (kg, price, serves)</label>
                    {sizes.map((size, i) => (
                        <div key={i} className="flex gap-2 mb-2">
                            <input type="number" step="0.5" value={size.kg} onChange={(e) => updateSize(i, 'kg', parseFloat(e.target.value) || 0)} className="border-4 border-black p-2 w-24" placeholder="kg" />
                            <input type="number" value={size.price} onChange={(e) => updateSize(i, 'price', parseFloat(e.target.value) || 0)} className="border-4 border-black p-2 w-32" placeholder="price" />
                            <input type="number" value={size.serves} onChange={(e) => updateSize(i, 'serves', parseInt(e.target.value, 10) || 0)} className="border-4 border-black p-2 w-24" placeholder="serves" />
                        </div>
                    ))}
                    <button type="button" onClick={addSize} className="text-sm font-bold underline">Add size</button>
                </div>
                <div>
                    <label className="block font-bold mb-2">Base price *</label>
                    <input type="number" value={data.base_price} onChange={(e) => setData('base_price', e.target.value)} className="w-full border-4 border-black p-2" required />
                </div>
                <div>
                    <label className="block font-bold mb-2">Image URL (first)</label>
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
                <button type="submit" disabled={processing} className="px-8 py-4 bg-black text-white font-black uppercase border-4 border-black">{processing ? 'Creating...' : 'Create'}</button>
            </form>
        </OwnerLayout>
    );
}

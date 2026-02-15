import OwnerLayout from '@/Layouts/OwnerLayout';
import { Head, useForm } from '@inertiajs/react';
import { Bakery } from '@/types';

interface Props {
    bakery: Bakery;
}

export default function BakeryEdit({ bakery }: Props) {
    const { data, setData, patch, processing, errors } = useForm({
        name: bakery.name,
        description: bakery.description ?? '',
        phone: bakery.phone ?? '',
        email: bakery.email ?? '',
        address: bakery.address ?? '',
        city: bakery.city ?? '',
        country: bakery.country ?? 'Kenya',
        is_active: bakery.is_active ?? true,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(`/owner/bakery/${bakery.id}`);
    };

    return (
        <OwnerLayout>
            <Head title="Edit Bakery" />
            <h1 className="text-3xl font-black uppercase mb-8 border-b-4 border-black pb-4">
                Edit bakery
            </h1>
            <form onSubmit={submit} className="max-w-2xl space-y-6">
                <div>
                    <label className="block font-bold mb-2">Name *</label>
                    <input
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        className="w-full border-4 border-black p-2"
                        required
                    />
                    {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
                </div>
                <div>
                    <label className="block font-bold mb-2">Description</label>
                    <textarea
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        className="w-full border-4 border-black p-2"
                        rows={3}
                    />
                </div>
                <div>
                    <label className="block font-bold mb-2">Phone</label>
                    <input
                        type="text"
                        value={data.phone}
                        onChange={(e) => setData('phone', e.target.value)}
                        className="w-full border-4 border-black p-2"
                    />
                </div>
                <div>
                    <label className="block font-bold mb-2">Email</label>
                    <input
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        className="w-full border-4 border-black p-2"
                    />
                </div>
                <div>
                    <label className="block font-bold mb-2">Address</label>
                    <input
                        type="text"
                        value={data.address}
                        onChange={(e) => setData('address', e.target.value)}
                        className="w-full border-4 border-black p-2"
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block font-bold mb-2">City</label>
                        <input
                            type="text"
                            value={data.city}
                            onChange={(e) => setData('city', e.target.value)}
                            className="w-full border-4 border-black p-2"
                        />
                    </div>
                    <div>
                        <label className="block font-bold mb-2">Country</label>
                        <input
                            type="text"
                            value={data.country}
                            onChange={(e) => setData('country', e.target.value)}
                            className="w-full border-4 border-black p-2"
                        />
                    </div>
                </div>
                <div>
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={data.is_active}
                            onChange={(e) => setData('is_active', e.target.checked)}
                        />
                        <span className="font-bold">Active</span>
                    </label>
                </div>
                <button
                    type="submit"
                    disabled={processing}
                    className="px-8 py-4 bg-black text-white font-black uppercase border-4 border-black"
                >
                    {processing ? 'Saving...' : 'Save'}
                </button>
            </form>
        </OwnerLayout>
    );
}

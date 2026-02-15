import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';

export default function Dashboard({ auth }: PageProps) {
    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />
            <h1 className="text-3xl font-black uppercase border-b-4 border-black pb-4 mb-6">Dashboard</h1>
            <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0_0_#000]">
                <p className="text-gray-900">You're logged in!</p>
            </div>
        </AuthenticatedLayout>
    );
}

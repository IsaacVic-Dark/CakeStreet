import { PropsWithChildren } from 'react';
import { usePage } from '@inertiajs/react';
import { User, PageProps } from '@/types';
import Navigation from '@/Components/Navigation';
import Footer from '@/Components/Footer';

export default function AuthenticatedLayout({ children }: PropsWithChildren) {
    const { auth } = usePage<PageProps<{ auth: { user: User } }>>().props;
    const user = auth.user;

    if (!user) return null;

    return (
        <div className="min-h-screen bg-neutral-50 flex flex-col">
            <Navigation user={user} />
            <main className="flex-grow container mx-auto px-4 py-8">{children}</main>
            <Footer />
        </div>
    );
}

import { PropsWithChildren } from 'react';
import Navigation from '@/Components/Navigation';
import Footer from '@/Components/Footer';

export default function GuestLayout({ children }: PropsWithChildren) {
    return (
        <div className="min-h-screen bg-neutral-50 flex flex-col">
            <Navigation />
            <main className="flex-grow">{children}</main>
            <Footer />
        </div>
    );
}

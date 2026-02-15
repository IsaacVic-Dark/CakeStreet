import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

export default function GuestLayout({ children }: PropsWithChildren) {
    return (
        <div className="min-h-screen bg-white">
            <nav className="border-b-4 border-black bg-amber-400">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="text-3xl font-black uppercase">
                            CakeStreet
                        </Link>
                        <div className="flex gap-4">
                            <Link
                                href="/login"
                                className="px-6 py-2 bg-white border-4 border-black font-bold uppercase shadow-[4px_4px_0_0_#000] hover:shadow-[2px_2px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                            >
                                Login
                            </Link>
                            <Link
                                href="/register"
                                className="px-6 py-2 bg-black text-white border-4 border-black font-bold uppercase shadow-[4px_4px_0_0_#000] hover:shadow-[2px_2px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                            >
                                Register
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <main>{children}</main>

            <footer className="border-t-4 border-black bg-gray-100 py-8 mt-16">
                <div className="container mx-auto px-4 text-center">
                    <p className="font-bold text-lg">CakeStreet. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}

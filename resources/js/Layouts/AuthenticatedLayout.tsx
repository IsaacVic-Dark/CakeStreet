import { useState, PropsWithChildren } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { User } from '@/types';
import { ShoppingCart, User as UserIcon, Package, LayoutDashboard, LogOut } from 'lucide-react';

export default function AuthenticatedLayout({ children }: PropsWithChildren) {
    const { auth } = usePage().props as { auth: { user: User } };
    const [showUserMenu, setShowUserMenu] = useState(false);
    const user = auth.user;

    if (!user) return null;

    return (
        <div className="min-h-screen bg-white">
            <nav className="border-b-4 border-black bg-amber-400">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="text-3xl font-black uppercase">
                            CakeStreet
                        </Link>

                        <div className="flex items-center gap-6">
                            <Link href="/products" className="font-bold uppercase hover:underline">
                                Browse Cakes
                            </Link>
                            <Link href="/designer" className="font-bold uppercase hover:underline">
                                Design Your Cake
                            </Link>

                            {(user.role === 'owner' || user.role === 'admin') && (
                                <Link
                                    href="/owner/dashboard"
                                    className="flex items-center gap-2 font-bold uppercase hover:underline"
                                >
                                    <LayoutDashboard size={20} />
                                    Owner Dashboard
                                </Link>
                            )}

                            <Link href="/cart" className="relative">
                                <ShoppingCart size={24} />
                            </Link>

                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center gap-2 px-4 py-2 bg-white border-4 border-black font-bold"
                                >
                                    <UserIcon size={20} />
                                    {user.name}
                                </button>

                                {showUserMenu && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white border-4 border-black shadow-[8px_8px_0_0_#000] z-10">
                                        <Link
                                            href="/my-orders"
                                            className="block px-4 py-2 border-b-4 border-black hover:bg-gray-100"
                                        >
                                            <Package size={16} className="inline mr-2" />
                                            My Orders
                                        </Link>
                                        <Link
                                            href="/profile"
                                            className="block px-4 py-2 border-b-4 border-black hover:bg-gray-100"
                                        >
                                            <UserIcon size={16} className="inline mr-2" />
                                            Profile
                                        </Link>
                                        <Link
                                            href="/logout"
                                            method="post"
                                            as="button"
                                            className="w-full text-left px-4 py-2 hover:bg-gray-100"
                                        >
                                            <LogOut size={16} className="inline mr-2" />
                                            Logout
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="container mx-auto px-4 py-8">{children}</main>
        </div>
    );
}

import { PropsWithChildren } from 'react';
import { Link } from '@inertiajs/react';
import {
    LayoutDashboard,
    Package,
    ShoppingBag,
    BarChart3,
    Settings,
} from 'lucide-react';

export default function OwnerLayout({ children }: PropsWithChildren) {
    const navigation = [
        { name: 'Dashboard', href: '/owner/dashboard', icon: LayoutDashboard },
        { name: 'Products', href: '/owner/products', icon: Package },
        { name: 'Orders', href: '/owner/orders', icon: ShoppingBag },
        { name: 'Analytics', href: '/owner/dashboard', icon: BarChart3 },
        { name: 'Bakery Settings', href: '/owner/bakery', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="flex">
                <aside className="w-64 bg-black text-white border-r-4 border-black min-h-screen flex flex-col">
                    <div className="p-6 border-b-4 border-white">
                        <h1 className="text-2xl font-black uppercase">Owner Panel</h1>
                    </div>

                    <nav className="p-4 flex-1">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="flex items-center gap-3 px-4 py-3 mb-2 text-white hover:bg-white hover:text-black border-4 border-transparent hover:border-white font-bold uppercase transition-all"
                            >
                                <item.icon size={20} />
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    <div className="p-4 border-t-4 border-white">
                        <Link
                            href="/"
                            className="block px-4 py-2 bg-white text-black text-center font-bold border-4 border-white hover:bg-gray-200"
                        >
                            Back to Store
                        </Link>
                    </div>
                </aside>

                <main className="flex-1 p-8">{children}</main>
            </div>
        </div>
    );
}

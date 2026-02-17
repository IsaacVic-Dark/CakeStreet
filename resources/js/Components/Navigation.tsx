import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { ShoppingCart, User as UserIcon, Menu, X, ChevronDown } from 'lucide-react';
import { User, PageProps } from '@/types';

interface NavigationProps {
    user?: User;
}

export default function Navigation({ user }: NavigationProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const { url } = usePage();

    const navigation = [
        { name: 'Home', href: '/' },
        { name: 'Products', href: '/products' },
        { name: 'Designer', href: '/designer' },
        { name: 'Outlets', href: '/outlets' },
        { name: 'Gallery', href: '/gallery' },
        { name: 'Contact Us', href: '/contact' },
    ];

    const isActive = (href: string) => {
        if (href === '/') {
            return url === '/';
        }
        return url.startsWith(href);
    };

    return (
        <nav className="bg-primary sticky top-0 z-50 shadow-soft-md">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="text-white">
                            <svg className="w-10 h-10" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20 5C15 5 10 8 10 15C10 20 15 25 20 30C25 25 30 20 30 15C30 8 25 5 20 5Z" fill="currentColor" />
                                <circle cx="20" cy="15" r="3" fill="#F6830F" />
                            </svg>
                        </div>
                        <span className="text-white font-display text-2xl font-semibold">
                            CakeStreet
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`text-sm font-medium transition-colors ${isActive(item.href)
                                        ? 'text-accent-orange'
                                        : 'text-white hover:text-accent-orange'
                                    }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    {/* Right Side Actions */}
                    <div className="hidden md:flex items-center space-x-4">
                        {/* Search */}
                        <div className="relative">
                            <input
                                type="search"
                                placeholder="Search Product..."
                                className="w-64 px-4 py-2 pr-10 text-sm rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-accent-orange"
                            />
                            <svg
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>

                        {user ? (
                            <>
                                {/* Cart Icon */}
                                <Link
                                    href="/cart"
                                    className="relative p-2 text-white hover:text-accent-orange transition-colors"
                                >
                                    <ShoppingCart size={24} />
                                    {/* Cart badge - you can add dynamic count here */}
                                    <span className="absolute -top-1 -right-1 bg-accent-orange text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                                        0
                                    </span>
                                </Link>

                                {/* User Dropdown */}
                                <div className="relative">
                                    <button
                                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                                        className="flex items-center space-x-2 p-2 rounded-full bg-white text-primary hover:bg-neutral-100 transition-colors"
                                    >
                                        <UserIcon size={20} />
                                    </button>

                                    {userMenuOpen && (
                                        <>
                                            <div
                                                className="fixed inset-0 z-10"
                                                onClick={() => setUserMenuOpen(false)}
                                            />
                                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-soft-lg z-20 py-2">
                                                <div className="px-4 py-3 border-b border-neutral-200">
                                                    <p className="text-sm font-semibold">{user.name}</p>
                                                    <p className="text-xs ">{user.email}</p>
                                                </div>
                                                <Link
                                                    href="/my-orders"
                                                    className="block px-4 py-2 text-sm hover:bg-neutral-100"
                                                >
                                                    My Orders
                                                </Link>
                                                <Link
                                                    href="/dashboard"
                                                    className="block px-4 py-2 text-sm hover:bg-neutral-100"
                                                >
                                                    Dashboard
                                                </Link>
                                                {(user.role === 'owner' || user.role === 'admin') && (
                                                    <Link
                                                        href="/owner/dashboard"
                                                        className="block px-4 py-2 text-sm hover:bg-neutral-100"
                                                    >
                                                        Owner Dashboard
                                                    </Link>
                                                )}
                                                <Link
                                                    href="/profile"
                                                    className="block px-4 py-2 text-sm hover:bg-neutral-100"
                                                >
                                                    Profile
                                                </Link>
                                                <div className="border-t border-neutral-200 mt-2 pt-2">
                                                    <Link
                                                        href="/logout"
                                                        method="post"
                                                        as="button"
                                                        className="w-full text-left px-4 py-2 text-sm text-accent-red hover:bg-neutral-100"
                                                    >
                                                        Logout
                                                    </Link>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="px-6 py-2 text-sm font-medium text-white hover:text-accent-orange transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className="px-6 py-2 text-sm font-medium bg-accent-orange text-white rounded-full hover:bg-opacity-90 transition-colors shadow-soft"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 text-white"
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-primary-75 border-t border-primary-100">
                    <div className="container mx-auto px-4 py-4 space-y-2">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`block px-4 py-2 rounded-md text-sm font-medium ${isActive(item.href)
                                        ? 'bg-accent-orange text-white'
                                        : 'text-white hover:bg-primary-100'
                                    }`}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {item.name}
                            </Link>
                        ))}

                        {user ? (
                            <>
                                <div className="border-t border-primary-100 pt-2 mt-2">
                                    <Link
                                        href="/cart"
                                        className="block px-4 py-2 rounded-md text-sm font-medium text-white hover:bg-primary-100"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Cart
                                    </Link>
                                    <Link
                                        href="/my-orders"
                                        className="block px-4 py-2 rounded-md text-sm font-medium text-white hover:bg-primary-100"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        My Orders
                                    </Link>
                                    <Link
                                        href="/profile"
                                        className="block px-4 py-2 rounded-md text-sm font-medium text-white hover:bg-primary-100"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Profile
                                    </Link>
                                    <Link
                                        href="/logout"
                                        method="post"
                                        as="button"
                                        className="w-full text-left px-4 py-2 rounded-md text-sm font-medium text-accent-red hover:bg-primary-100"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Logout
                                    </Link>
                                </div>
                            </>
                        ) : (
                            <div className="border-t border-primary-100 pt-2 mt-2 space-y-2">
                                <Link
                                    href="/login"
                                    className="block px-4 py-2 rounded-md text-sm font-medium text-white hover:bg-primary-100"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className="block px-4 py-2 rounded-md text-sm font-medium bg-accent-orange text-white hover:bg-opacity-90"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}

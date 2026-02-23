import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GuestLayout from '@/Layouts/GuestLayout';
import ProductCard from '@/Components/ProductCard';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Product } from '@/types';
import { useState } from 'react';

interface PaginatedProducts {
    data: Product[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    products: PaginatedProducts;
    filters: { category?: string; search?: string; is_eggless?: boolean; is_sugar_free?: boolean };
    categories: string[];
}

export default function Index({ products, filters, categories }: Props) {
    const { auth } = usePage<PageProps>().props;
    const Layout = auth.user ? AuthenticatedLayout : GuestLayout;

    const [selectedCategories, setSelectedCategories] = useState<string[]>(
        filters.category ? [filters.category] : []
    );
    const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);

    const priceRanges = [
        { id: '0-100', label: 'Kes0 - Kes100', min: 0, max: 100 },
        { id: '101-200', label: 'Kes101 - Kes200', min: 101, max: 200 },
        { id: '201-300', label: 'Kes201 - Kes300', min: 201, max: 300 },
        { id: '301-400', label: 'Kes301 - Kes400', min: 301, max: 400 },
        { id: '301-400-alt', label: 'Kes301 - Kes400', min: 301, max: 400 },
        { id: '401-500', label: 'Kes401 - Kes500', min: 401, max: 500 },
        { id: '501-600', label: 'Kes501 - Kes600', min: 501, max: 600 },
    ];

    const toggleCategory = (category: string) => {
        const newCategories = selectedCategories.includes(category)
            ? selectedCategories.filter(c => c !== category)
            : [...selectedCategories, category];
        setSelectedCategories(newCategories);
    };

    const togglePriceRange = (rangeId: string) => {
        const newRanges = selectedPriceRanges.includes(rangeId)
            ? selectedPriceRanges.filter(r => r !== rangeId)
            : [...selectedPriceRanges, rangeId];
        setSelectedPriceRanges(newRanges);
    };

    return (
        <Layout>
            <Head title="Cakes" />
            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">
                    Explore Our Shop
                </h1>

                <div className="flex gap-8">
                    {/* Sidebar Filters */}
                    <aside className="w-64 flex-shrink-0">
                        {/* Categories Filter */}
                        <div className="bg-white rounded-lg shadow-card p-6 mb-6">
                            <button className="flex items-center justify-between w-full mb-4">
                                <h3 className="font-semibold">Categories</h3>
                                <span className="">▼</span>
                            </button>
                            <div className="space-y-3">
                                {categories.map((category) => (
                                    <label key={category} className="flex items-center gap-3 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={selectedCategories.includes(category)}
                                            onChange={() => toggleCategory(category)}
                                            className="w-4 h-4 rounded border-neutral-300 text-primary focus:ring-primary cursor-pointer"
                                        />
                                        <span className="text-sm group-hover:text-typography-100">
                                            {category}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Price Ranges Filter */}
                        <div className="bg-white rounded-lg shadow-card p-6">
                            <button className="flex items-center justify-between w-full mb-4">
                                <h3 className="font-semibold">Price Ranges</h3>
                                <span className="">▼</span>
                            </button>
                            <div className="space-y-3">
                                {priceRanges.map((range) => (
                                    <label key={range.id} className="flex items-center gap-3 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={selectedPriceRanges.includes(range.id)}
                                            onChange={() => togglePriceRange(range.id)}
                                            className="w-4 h-4 rounded border-neutral-300 text-primary focus:ring-primary cursor-pointer"
                                        />
                                        <span className="text-sm group-hover:text-typography-100">
                                            {range.label}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Search and Filters Bar */}
                        <div className="bg-white rounded-lg shadow-card p-6 mb-6">
                            <form method="get" className="flex flex-wrap gap-4 items-center">
                                <input
                                    type="text"
                                    name="search"
                                    placeholder="Search Product..."
                                    defaultValue={filters.search}
                                    className="flex-1 min-w-[200px] border border-neutral-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                                
                                <select
                                    name="category"
                                    className="border border-neutral-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="">All categories</option>
                                    {categories.map((c) => (
                                        <option key={c} value={c} selected={filters.category === c}>
                                            {c}
                                        </option>
                                    ))}
                                </select>

                                <label className="flex items-center gap-2 text-sm">
                                    <input 
                                        type="checkbox" 
                                        name="is_eggless" 
                                        value="1" 
                                        defaultChecked={filters.is_eggless}
                                        className="w-4 h-4 rounded border-neutral-300 text-primary focus:ring-primary"
                                    />
                                    <span className="">Eggless</span>
                                </label>

                                <label className="flex items-center gap-2 text-sm">
                                    <input 
                                        type="checkbox" 
                                        name="is_sugar_free" 
                                        value="1" 
                                        defaultChecked={filters.is_sugar_free}
                                        className="w-4 h-4 rounded border-neutral-300 text-primary focus:ring-primary"
                                    />
                                    <span className="">Sugar free</span>
                                </label>

                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-primary text-white text-sm font-semibold rounded hover:bg-primary-75 transition-colors"
                                >
                                    Filter
                                </button>
                            </form>
                        </div>

                        {/* Products Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {products.data.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>

                        {products.data.length === 0 && (
                            <div className="text-center py-16">
                                <p className="text-xl font-semibold ">No cakes found.</p>
                            </div>
                        )}

                        {/* Pagination - Keeping the existing pagination logic but commented out for now as per your request */}
                        {/* {products.last_page > 1 && (
                            <div className="flex justify-center gap-2 mt-8">
                                {products.links.map((link, i) => (
                                    <span key={i}>
                                        {link.url ? (
                                            <Link
                                                href={link.url}
                                                className={`px-4 py-2 rounded border ${
                                                    link.active 
                                                        ? 'bg-primary text-white border-primary' 
                                                        : 'bg-white border-neutral-300 hover:bg-neutral-50'
                                                }`}
                                            >
                                                {link.label.replace('&laquo;', '').replace('&raquo;', '').trim() || (i === 0 ? 'Prev' : 'Next')}
                                            </Link>
                                        ) : (
                                            <span className="px-4 py-2 rounded border border-neutral-200 text-neutral-400">
                                                {link.label.replace('&laquo;', '').replace('&raquo;', '').trim()}
                                            </span>
                                        )}
                                    </span>
                                ))}
                            </div>
                        )} */}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
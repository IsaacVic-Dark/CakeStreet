import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GuestLayout from '@/Layouts/GuestLayout';
import ProductCard from '@/Components/ProductCard';
import { Head, Link, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Product } from '@/types';

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

    return (
        <Layout>
            <Head title="Cakes" />
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-black uppercase mb-8 border-b-4 border-black pb-4">
                    Cake Catalog
                </h1>

                <div className="flex flex-wrap gap-4 mb-8">
                    <form method="get" className="flex flex-wrap gap-2 items-center">
                        <input
                            type="text"
                            name="search"
                            placeholder="Search..."
                            defaultValue={filters.search}
                            className="border-4 border-black px-4 py-2"
                        />
                        <select
                            name="category"
                            className="border-4 border-black px-4 py-2"
                        >
                            <option value="">All categories</option>
                            {categories.map((c) => (
                                <option key={c} value={c} selected={filters.category === c}>
                                    {c}
                                </option>
                            ))}
                        </select>
                        <label className="flex items-center gap-2">
                            <input type="checkbox" name="is_eggless" value="1" defaultChecked={filters.is_eggless} />
                            Eggless
                        </label>
                        <label className="flex items-center gap-2">
                            <input type="checkbox" name="is_sugar_free" value="1" defaultChecked={filters.is_sugar_free} />
                            Sugar free
                        </label>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-black text-white border-4 border-black font-bold"
                        >
                            Filter
                        </button>
                    </form>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.data.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                {products.data.length === 0 && (
                    <p className="text-center py-12 text-xl font-bold">No cakes found.</p>
                )}

                {products.last_page > 1 && (
                    <div className="flex justify-center gap-2 mt-8">
                        {products.links.map((link, i) => (
                            <span key={i}>
                                {link.url ? (
                                    <Link
                                        href={link.url}
                                        className={`px-4 py-2 border-4 border-black font-bold ${
                                            link.active ? 'bg-black text-white' : 'bg-white'
                                        }`}
                                    >
                                        {link.label.replace('&laquo;', '').replace('&raquo;', '').trim() || (i === 0 ? 'Prev' : 'Next')}
                                    </Link>
                                ) : (
                                    <span className="px-4 py-2 border-4 border-gray-300 text-gray-400">
                                        {link.label.replace('&laquo;', '').replace('&raquo;', '').trim()}
                                    </span>
                                )}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
}

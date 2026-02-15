import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GuestLayout from '@/Layouts/GuestLayout';
import ProductCard from '@/Components/ProductCard';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { PageProps, Product } from '@/types';
import { useState } from 'react';

interface Props {
    product: Product;
    relatedProducts: Product[];
}

export default function Show({ product, relatedProducts }: Props) {
    const { auth } = usePage<PageProps>().props;
    const Layout = auth.user ? AuthenticatedLayout : GuestLayout;
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState<{ kg: number; price: number; serves: number } | null>(
        product.available_sizes?.[0] ?? null
    );
    const price = selectedSize ? selectedSize.price : Number(product.base_price);

    const addToCart = () => {
        router.post('/cart/add', {
            product_id: product.id,
            quantity,
            customization: selectedSize ? { size: selectedSize } : undefined,
        });
    };

    const imageUrl = product.image_urls?.[0] ?? '/images/placeholder-cake.jpg';

    return (
        <Layout>
            <Head title={product.name} />
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <div className="border-4 border-black shadow-[8px_8px_0_0_#000] overflow-hidden">
                        <img
                            src={imageUrl}
                            alt={product.name}
                            className="w-full h-96 object-cover"
                        />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black uppercase mb-4">{product.name}</h1>
                        <p className="text-lg font-bold text-gray-600 mb-4">{product.category}</p>
                        <p className="text-gray-700 mb-6">{product.description}</p>

                        {product.available_sizes && product.available_sizes.length > 0 && (
                            <div className="mb-6">
                                <p className="font-bold mb-2">Size</p>
                                <div className="flex flex-wrap gap-2">
                                    {product.available_sizes.map((size) => (
                                        <button
                                            key={`${size.kg}-${size.price}`}
                                            type="button"
                                            onClick={() => setSelectedSize(size)}
                                            className={`px-4 py-2 border-4 border-black font-bold ${
                                                selectedSize?.price === size.price
                                                    ? 'bg-black text-white'
                                                    : 'bg-white'
                                            }`}
                                        >
                                            {size.kg} kg (Serves {size.serves}) - KES {Number(size.price).toLocaleString()}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex items-center gap-4 mb-6">
                            <label className="font-bold">Qty</label>
                            <input
                                type="number"
                                min={1}
                                value={quantity}
                                onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)}
                                className="w-20 border-4 border-black px-2 py-2"
                            />
                        </div>

                        <p className="text-2xl font-black mb-6">KES {(price * quantity).toLocaleString()}</p>

                        {auth.user && (
                            <button
                                type="button"
                                onClick={addToCart}
                                className="px-8 py-4 bg-black text-white font-black uppercase border-4 border-black shadow-[4px_4px_0_0_#000] hover:bg-amber-400 hover:text-black transition-colors"
                            >
                                Add to Cart
                            </button>
                        )}
                        {!auth.user && (
                            <Link
                                href="/login"
                                className="inline-block px-8 py-4 bg-black text-white font-black uppercase border-4 border-black"
                            >
                                Login to add to cart
                            </Link>
                        )}
                    </div>
                </div>

                {relatedProducts.length > 0 && (
                    <>
                        <h2 className="text-2xl font-black uppercase mb-6 border-b-4 border-black pb-4">
                            You may also like
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.map((p) => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </Layout>
    );
}

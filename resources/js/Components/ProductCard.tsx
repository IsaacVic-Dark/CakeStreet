import { Product } from '@/types';
import { Link } from '@inertiajs/react';
import { Star } from 'lucide-react';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const imageUrl = product.image_urls?.[0] ?? '/images/placeholder-cake.jpg';

    return (
        <div className="group relative bg-white border-4 border-black shadow-[8px_8px_0_0_#000] hover:shadow-[4px_4px_0_0_#000] hover:translate-x-[4px] hover:translate-y-[4px] transition-all">
            <div className="relative h-64 overflow-hidden border-b-4 border-black">
                <img
                    src={imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {product.is_featured && (
                    <div className="absolute top-4 right-4 bg-amber-400 px-4 py-2 border-4 border-black font-black uppercase">
                        Featured
                    </div>
                )}
            </div>
            <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h3 className="text-xl font-black uppercase mb-2">{product.name}</h3>
                        <p className="text-sm font-bold text-gray-600">{product.category}</p>
                    </div>
                    {product.average_rating != null && product.average_rating > 0 && (
                        <div className="flex items-center gap-1 bg-amber-400 px-3 py-1 border-2 border-black">
                            <Star size={16} fill="currentColor" />
                            <span className="font-bold">{Number(product.average_rating).toFixed(1)}</span>
                        </div>
                    )}
                </div>
                <p className="text-gray-700 mb-4 line-clamp-2">{product.description}</p>
                <div className="flex items-center gap-2 mb-4">
                    {product.is_eggless && (
                        <span className="px-2 py-1 bg-green-100 border-2 border-black text-xs font-bold">EGGLESS</span>
                    )}
                    {product.is_sugar_free && (
                        <span className="px-2 py-1 bg-blue-100 border-2 border-black text-xs font-bold">SUGAR FREE</span>
                    )}
                </div>
                <div className="flex items-end justify-between">
                    <div>
                        <p className="text-sm font-bold text-gray-600">From</p>
                        <p className="text-2xl font-black">KES {Number(product.base_price).toLocaleString()}</p>
                    </div>
                    <Link
                        href={`/products/${product.slug}`}
                        className="px-6 py-3 bg-black text-white font-black uppercase border-4 border-black hover:bg-amber-400 hover:text-black transition-colors"
                    >
                        View
                    </Link>
                </div>
            </div>
        </div>
    );
}

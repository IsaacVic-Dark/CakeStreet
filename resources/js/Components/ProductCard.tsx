import { Product } from '@/types';
import { Link } from '@inertiajs/react';
import { Star, ShoppingCart } from 'lucide-react';
import Card from '@/Components/UI/Card';
import Button from '@/Components/UI/Button';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const imageUrl = product.image_urls?.[0] ?? '/images/placeholder-cake.jpg';
    const rating = product.average_rating || 4.5;

    return (
        <Card hover padding="none" className="overflow-hidden group">
            <Link href={`/products/${product.slug}`}>
                <div className="relative overflow-hidden">
                    <img
                        src={imageUrl}
                        alt={product.name}
                        className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {product.category && (
                        <span className="absolute top-3 left-3 px-3 py-1 bg-white text-primary text-xs font-semibold rounded-full shadow-soft">
                            {product.category}
                        </span>
                    )}
                    {product.is_featured && (
                        <span className="absolute top-3 right-3 px-3 py-1 bg-accent-orange text-white text-xs font-semibold rounded-full shadow-soft">
                            Featured
                        </span>
                    )}
                </div>

                <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2 line-clamp-1 group-hover:text-accent-orange transition-colors">
                        {product.name}
                    </h3>

                    <p className="text-sm mb-3 line-clamp-2">
                        {product.description}
                    </p>

                    {rating > 0 && (
                        <div className="flex items-center gap-1 mb-3">
                            <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={14}
                                        className={i < Math.floor(rating) ? 'fill-accent-orange text-accent-orange' : 'text-neutral-300'}
                                    />
                                ))}
                            </div>
                            <span className="text-xs ml-1">
                                ({Number(rating).toFixed(1)})
                            </span>
                        </div>
                    )}

                    <div className="flex items-center gap-2 mb-3">
                        {product.is_eggless && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">
                                Eggless
                            </span>
                        )}
                        {product.is_sugar_free && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
                                Sugar Free
                            </span>
                        )}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-neutral-200">
                        <div>
                            <p className="text-xs ">From</p>
                            <span className="text-2xl font-bold text-primary">
                                ৳{Number(product.base_price).toLocaleString()}
                            </span>
                        </div>

                        <Button
                            variant="primary"
                            size="sm"
                            className="gap-2"
                            onClick={(e) => {
                                e.preventDefault();
                                // View product details
                                window.location.href = `/products/${product.slug}`;
                            }}
                        >
                            View
                        </Button>
                    </div>
                </div>
            </Link>
        </Card>
    );
}

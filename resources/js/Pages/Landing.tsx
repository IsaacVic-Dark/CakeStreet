import { Head, Link } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import ProductCard from '@/Components/ProductCard';
import Button from '@/Components/UI/Button';
import { Product } from '@/types';
import { ArrowRight, Star, Clock, Shield, Award } from 'lucide-react';

interface LandingProps {
    featuredProducts: Product[];
    categories: string[];
}

export default function Landing({ featuredProducts, categories }: LandingProps) {
    const testimonials = [
        {
            id: 1,
            name: 'Sarah Johnson',
            rating: 5,
            comment: 'The best cakes in town! Fresh, delicious, and beautifully designed.',
            image: '/images/testimonials/user1.jpg',
        },
        {
            id: 2,
            name: 'Michael Chen',
            rating: 5,
            comment: 'Amazing quality and service. My go-to bakery for all celebrations!',
            image: '/images/testimonials/user2.jpg',
        },
        {
            id: 3,
            name: 'Emily Davis',
            rating: 5,
            comment: 'Incredible flavors and stunning presentation. Highly recommended!',
            image: '/images/testimonials/user3.jpg',
        },
    ];

    const features = [
        {
            icon: Clock,
            title: 'Fresh Daily',
            description: 'All our products are baked fresh every day using premium ingredients',
        },
        {
            icon: Shield,
            title: 'Quality Assured',
            description: 'We maintain the highest standards of quality and hygiene',
        },
        {
            icon: Award,
            title: 'Award Winning',
            description: 'Recognized for excellence in taste and presentation',
        },
    ];

    return (
        <GuestLayout>
            <Head title="Welcome to CakeStreet" />

            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-primary-400 via-primary-300 to-neutral-100 overflow-hidden">
                <div className="container mx-auto px-4 py-20 md:py-28">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <h1 className="font-display text-display-xl md:text-6xl lg:text-7xl text-primary leading-tight">
                                Discover Quality Products
                                <span className="block text-accent-orange">Our All Outlets</span>
                            </h1>
                            <p className="text-lg text-typography-75 max-w-lg">
                                Stay informed with the latest developments, exclusive deals, and stories that matter. From new product launches and special events.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Link href="/products">
                                    <Button variant="primary" size="lg" className="gap-2">
                                        Browse Products
                                        <ArrowRight size={20} />
                                    </Button>
                                </Link>
                                <Link href="/designer">
                                    <Button variant="outline" size="lg">
                                        Design Your Cake
                                    </Button>
                                </Link>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="relative z-10">
                                <img
                                    src="/images/hero-cake.jpg"
                                    alt="Delicious Cakes"
                                    className="rounded-2xl shadow-soft-lg"
                                    onError={(e) => {
                                        e.currentTarget.src = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=600&fit=crop';
                                    }}
                                />
                            </div>
                            <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-accent-orange rounded-full opacity-20 blur-3xl"></div>
                            <div className="absolute -top-6 -left-6 w-48 h-48 bg-primary rounded-full opacity-20 blur-3xl"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="font-display text-display-m text-primary mb-4">
                            Featured Products
                        </h2>
                        <p className="text-typography-300 max-w-2xl mx-auto">
                            Discover our handpicked selection of premium cakes and desserts
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {featuredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                    <div className="text-center">
                        <Link href="/products">
                            <Button variant="outline" size="lg" className="gap-2">
                                View All Products
                                <ArrowRight size={20} />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="py-16 bg-neutral-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="font-display text-display-m text-primary mb-4">
                            Browse by Category
                        </h2>
                        <p className="text-typography-300 max-w-2xl mx-auto">
                            Explore our wide range of delicious categories
                        </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {categories.map((category, index) => (
                            <Link
                                key={index}
                                href={`/products?category=${encodeURIComponent(category)}`}
                                className="group relative bg-white rounded-lg p-6 text-center hover:shadow-card-hover transition-all duration-300"
                            >
                                <div className="mb-4">
                                    <div className="w-16 h-16 mx-auto bg-primary-400 rounded-full flex items-center justify-center group-hover:bg-accent-orange transition-colors">
                                        <span className="text-2xl">🎂</span>
                                    </div>
                                </div>
                                <h3 className="font-semibold text-typography-100 group-hover:text-accent-orange transition-colors">
                                    {category}
                                </h3>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-8">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <div key={index} className="text-center">
                                    <div className="w-16 h-16 mx-auto mb-4 bg-primary-400 rounded-full flex items-center justify-center">
                                        <Icon size={32} className="text-primary" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-typography-100 mb-2">
                                        {feature.title}
                                    </h3>
                                    <p className="text-typography-300">
                                        {feature.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-16 bg-neutral-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="font-display text-display-m text-primary mb-4">
                            What Our Customers Say
                        </h2>
                        <p className="text-typography-300 max-w-2xl mx-auto">
                            Don't just take our word for it - hear from our satisfied customers
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {testimonials.map((testimonial) => (
                            <div key={testimonial.id} className="bg-white rounded-lg p-6 shadow-card">
                                <div className="flex items-center gap-1 mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} size={16} className="fill-accent-orange text-accent-orange" />
                                    ))}
                                </div>
                                <p className="text-typography-100 mb-4">"{testimonial.comment}"</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-primary-400 rounded-full flex items-center justify-center text-white font-semibold">
                                        {testimonial.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-typography-100">{testimonial.name}</p>
                                        <p className="text-sm text-typography-300">Verified Customer</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-primary text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="font-display text-display-m mb-4">
                        Ready to Order Your Perfect Cake?
                    </h2>
                    <p className="text-lg text-primary-300 mb-8 max-w-2xl mx-auto">
                        Browse our collection or design your own custom cake today
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href="/products">
                            <Button variant="secondary" size="lg" className="gap-2">
                                Browse Products
                                <ArrowRight size={20} />
                            </Button>
                        </Link>
                        <Link href="/contact">
                            <Button variant="outline" size="lg" className="text-white border-white hover:bg-white hover:text-primary">
                                Contact Us
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </GuestLayout>
    );
}

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import GuestLayout from "@/Layouts/GuestLayout";
import ProductCard from "@/Components/ProductCard";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { PageProps, Product } from "@/types";
import { useState } from "react";
import { Star } from "lucide-react";

interface Props {
    product: Product;
    relatedProducts: Product[];
}

export default function Show({ product, relatedProducts }: Props) {
    const { auth } = usePage<PageProps>().props;
    const Layout = auth.user ? AuthenticatedLayout : GuestLayout;
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState<{
        kg: number;
        price: number;
        serves: number;
    } | null>(product.available_sizes?.[0] ?? null);
    const [activeTab, setActiveTab] = useState<"description" | "details">(
        "description",
    );

    const price = selectedSize
        ? selectedSize.price
        : Number(product.base_price);

    const addToCart = () => {
        router.post("/cart/add", {
            product_id: product.id,
            quantity,
            customization: selectedSize ? { size: selectedSize } : undefined,
        });
    };

    const imageUrl = product.image_urls?.[0] ?? "/images/placeholder-cake.jpg";

    // HARD CODED - Frequently Bought Together Products
    const frequentlyBoughtTogether = [
        {
            id: "1",
            name: "Chocolate Fudge Cake",
            category: "Cakes & Pastries",
            image: "/images/placeholder-cake.jpg",
            price: 1200,
            originalPrice: null,
            description:
                "Soft, creamy, and melt-in-your-mouth goodness our signature Malai Chamcham",
        },
        {
            id: "2",
            name: "Red Velvet Cake",
            category: "Cakes & Pastries",
            image: "/images/placeholder-cake.jpg",
            price: 1200,
            originalPrice: null,
            description:
                "Soft, creamy, and melt-in-your-mouth goodness our signature Malai Chamcham",
        },
        {
            id: "3",
            name: "Fresh Cream Cake",
            category: "Cakes & Pastries",
            image: "/images/placeholder-cake.jpg",
            price: 1200,
            originalPrice: null,
            description:
                "Soft, creamy, and melt-in-your-mouth goodness our signature Malai Chamcham",
        },
        {
            id: "4",
            name: "Essential Triple Pack",
            category: "Special offer",
            image: "/images/placeholder-cake.jpg",
            price: 1600,
            originalPrice: 1400,
            description:
                "Enjoy receiving three useful products packaged together in one simple bundle.",
        },
    ];

    // HARD CODED - Customer Ratings Data
    const customerRatings = {
        averageRating: 3.6,
        totalReviews: 5,
        breakdown: [
            { stars: 5, percentage: 52, count: Math.floor(5 * 0.52) },
            { stars: 4, percentage: 19, count: Math.floor(5 * 0.19) },
            { stars: 3, percentage: 6, count: Math.floor(5 * 0.06) },
            { stars: 2, percentage: 30, count: Math.floor(5 * 0.3) },
            { stars: 1, percentage: 2, count: Math.floor(5 * 0.02) },
        ],
    };

    // HARD CODED - Product Description Content
    const productDescription = {
        main: "Discover the perfect blend of style, comfort, and durability with our latest shoe collection — designed for everyday wear, but crafted to make a statement. Whether you're dressing up for work, heading out with friends, or just looking for shoes that keep you moving, these are designed with you in mind.",
        ingredients: [
            "Burger Bun: Soft sesame or brioche bun (toasted for extra flavor)",
            "Fried Chicken Filet - Chicken breast or thigh marinated and deep-fried",
            "Lettuce, tomato, pickles, onion rings (or any extras of choice)",
        ],
        addOns: ["Coleslaw, Jalapeños, Onion rings, Bacon strips"],
        variations: [
            "Spicy Chicken Burger - Chicken marinated in chili buttermilk or hot sauces",
            "Zinger-style Burger - Inspired by KFC's spicy and crispy filet style",
            "Double Chicken Burger - Two filets stacked for a hearty meal",
        ],
        features: [
            "Breathable materials to keep your feet cool and comfortable all day long",
            "Versatile style — perfect for work, weekends, or travel",
            "Lightweight sole for easy movement and reduced fatigue",
            "Premium craftsmanship with durable stitching and finishes",
        ],
    };

    return (
        <Layout>
            <Head title={product.name} />
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm mb-6">
                <Link href="/" className="hover:text-primary">
                    Home
                </Link>
                <span>›</span>
                <Link href="/categories" className="hover:text-primary">
                    Categories
                </Link>
                <span>›</span>
                <Link
                    href={`/categories/${product.category}`}
                    className="hover:text-primary"
                >
                    {product.category || "Snacks & Savouries"}
                </Link>
                <span>›</span>
                <span className="">{product.name}</span>
            </div>
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Product Details Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                    {/* Product Image */}
                    <div className="bg-neutral-100 rounded-lg overflow-hidden">
                        {product.image_urls?.[0] ? (
                            <img
                                src={imageUrl}
                                alt={product.name}
                                className="w-full h-96 object-cover"
                            />
                        ) : (
                            <div className="w-full h-96 flex items-center justify-center bg-neutral-200">
                                <span className="text-lg">
                                    No Image Available
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div>
                        <h1 className="text-4xl font-bold mb-2">
                            {product.name}
                        </h1>

                        <div className="mb-4">
                            <p className="text-sm ">
                                <span className="font-semibold">
                                    Department:
                                </span>{" "}
                                {product.category || "Hot"}
                            </p>
                            <p className="text-sm ">
                                <span className="font-semibold">Unit:</span> Pcs
                            </p>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold ">
                                    Rate:
                                </span>
                                <span className="text-sm text-green-600 font-semibold">
                                    90%
                                </span>
                                <span className="text-sm text-red-500 line-through">
                                    120%
                                </span>
                            </div>
                        </div>

                        <p className="mb-6 leading-relaxed">
                            <span className="font-semibold">Description:</span>{" "}
                            {product.description ||
                                "Exclusive Chicken fry burger made with hand selected pure Almonds,Pista & Cashews in Fancy Box. No Milk or Milk products used."}
                        </p>

                        {/* Weight/Size Selection */}
                        {product.available_sizes &&
                            product.available_sizes.length > 0 && (
                                <div className="mb-6">
                                    <p className="font-semibold mb-3">Weight</p>
                                    <select className="w-full max-w-xs border border-neutral-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                                        {product.available_sizes.map((size) => (
                                            <option
                                                key={`${size.kg}-${size.price}`}
                                                value={size.kg}
                                            >
                                                {size.kg}kg - KES{" "}
                                                {Number(
                                                    size.price,
                                                ).toLocaleString()}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                        {/* Quantity */}
                        <div className="mb-6">
                            <p className="font-semibold mb-3">Quantity:</p>
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setQuantity(Math.max(1, quantity - 1))
                                    }
                                    className="w-10 h-10 flex items-center justify-center border border-neutral-300 rounded hover:bg-neutral-100 text-lg font-semibold"
                                >
                                    −
                                </button>
                                <input
                                    type="number"
                                    min={1}
                                    value={quantity}
                                    onChange={(e) =>
                                        setQuantity(
                                            parseInt(e.target.value, 10) || 1,
                                        )
                                    }
                                    className="w-20 text-center border border-neutral-300 rounded px-2 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                                <button
                                    type="button"
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="w-10 h-10 flex items-center justify-center bg-primary text-white rounded hover:bg-primary-75 text-lg font-semibold"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Buy Now Button */}
                        {auth.user ? (
                            <button
                                type="button"
                                onClick={addToCart}
                                className="w-full max-w-xs px-8 py-3 bg-primary text-white font-semibold rounded hover:bg-primary-75 transition-colors"
                            >
                                Add Cart
                            </button>
                        ) : (
                            <Link
                                href="/login"
                                className="inline-block w-full max-w-xs text-center px-8 py-3 bg-primary text-white font-semibold rounded hover:bg-primary-75 transition-colors"
                            >
                                Login to Buy
                            </Link>
                        )}
                    </div>
                </div>

                {/* Frequently Bought Together Section */}
                <div className="mb-16">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold">
                            Frequently Bought Together
                        </h2>
                        <div className="flex gap-2">
                            <button className="w-10 h-10 flex items-center justify-center border border-neutral-300 rounded hover:bg-neutral-100">
                                ←
                            </button>
                            <button className="w-10 h-10 flex items-center justify-center bg-primary text-white rounded hover:bg-primary-75">
                                →
                            </button>
                        </div>
                    </div>

                    {/* HARD CODED */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {frequentlyBoughtTogether.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white rounded-lg shadow-card overflow-hidden hover:shadow-card-hover transition-shadow"
                            >
                                <div className="bg-neutral-100 h-48 flex items-center justify-center">
                                    <span className="">Product Image</span>
                                </div>
                                <div className="p-4">
                                    <p className="text-xs mb-1">
                                        {item.category}
                                    </p>
                                    <h3 className="font-semibold mb-2">
                                        {item.name}
                                    </h3>
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-lg font-bold">
                                            Kes{item.price}kg
                                        </span>
                                        {item.originalPrice && (
                                            <>
                                                <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded">
                                                    Save
                                                </span>
                                                <span className="text-sm line-through">
                                                    Kes{item.originalPrice}kg
                                                </span>
                                            </>
                                        )}
                                    </div>
                                    <p className="text-xs mb-4 line-clamp-2">
                                        {item.description}
                                    </p>
                                    <button className="w-full py-2 bg-primary text-white text-sm font-semibold rounded hover:bg-primary-75 transition-colors">
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tabs Section - Description, Product Details, Customer Rating */}
                <div className="mb-16">
                    <div className="border-b border-neutral-200 mb-6">
                        <div className="flex gap-8">
                            <button
                                onClick={() => setActiveTab("description")}
                                className={`pb-4 font-semibold transition-colors ${
                                    activeTab === "description"
                                        ? "text-typography-100 border-b-2 border-typography-100"
                                        : "hover:text-typography-100"
                                }`}
                            >
                                Description
                            </button>
                            <button
                                onClick={() => setActiveTab("details")}
                                className={`pb-4 font-semibold transition-colors ${
                                    activeTab === "details"
                                        ? "text-typography-100 border-b-2 border-typography-100"
                                        : "hover:text-typography-100"
                                }`}
                            >
                                Product details
                            </button>
                            {/* <div className="pb-4 font-semibold ">
                                Customers Rating
                            </div> */}
                        </div>
                    </div>

                    {/* Tab Content */}
                    {activeTab === "description" && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2">
                                {/* HARD CODED - Description Content */}
                                <h3 className="text-xl font-bold mb-4">
                                    Description
                                </h3>
                                <p className="mb-6 leading-relaxed">
                                    {productDescription.main}
                                </p>

                                <div className="mb-6">
                                    <h4 className="font-semibold mb-3">
                                        Our Product Attributes:
                                    </h4>
                                    <ol className="list-decimal list-inside space-y-2 ">
                                        <li>
                                            <span className="font-semibold">
                                                Basic Ingredients
                                            </span>
                                            <ul className="ml-6 mt-2 space-y-1 list-disc list-inside">
                                                {productDescription.ingredients.map(
                                                    (ingredient, idx) => (
                                                        <li key={idx}>
                                                            {ingredient}
                                                        </li>
                                                    ),
                                                )}
                                            </ul>
                                        </li>
                                        <li>
                                            <span className="font-semibold">
                                                Optional Add-ons
                                            </span>
                                            <ul className="ml-6 mt-2 space-y-1 list-disc list-inside">
                                                {productDescription.addOns.map(
                                                    (addon, idx) => (
                                                        <li key={idx}>
                                                            {addon}
                                                        </li>
                                                    ),
                                                )}
                                            </ul>
                                        </li>
                                        <li>
                                            <span className="font-semibold">
                                                Popular Variations
                                            </span>
                                            <ul className="ml-6 mt-2 space-y-1 list-disc list-inside">
                                                {productDescription.variations.map(
                                                    (variation, idx) => (
                                                        <li key={idx}>
                                                            {variation}
                                                        </li>
                                                    ),
                                                )}
                                            </ul>
                                        </li>
                                    </ol>
                                </div>
                            </div>

                            {/* HARD CODED - Customer Ratings Sidebar */}
                            <div className="bg-neutral-50 p-6 rounded-lg h-fit">
                                <h3 className="text-xl font-bold mb-4">
                                    Customers Rating
                                </h3>

                                <div className="flex items-center gap-2 mb-6">
                                    <div className="flex">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                size={24}
                                                className={
                                                    star <=
                                                    Math.floor(
                                                        customerRatings.averageRating,
                                                    )
                                                        ? "fill-accent-orange text-accent-orange"
                                                        : "text-neutral-300"
                                                }
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-3xl font-bold">
                                            {customerRatings.averageRating.toFixed(
                                                1,
                                            )}
                                        </span>
                                        <span className="text-sm ">
                                            out of 5
                                        </span>
                                    </div>
                                    <div className="flex gap-1 mb-2">
                                        <button className="text-sm px-3 py-1 border border-neutral-300 rounded hover:bg-neutral-100">
                                            {customerRatings.averageRating.toFixed(
                                                1,
                                            )}{" "}
                                            out of 5 ▼
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    {customerRatings.breakdown.map((item) => (
                                        <div
                                            key={item.stars}
                                            className="flex items-center gap-3"
                                        >
                                            <span className="text-sm w-12">
                                                {item.stars} Star
                                            </span>
                                            <div className="flex-1 bg-neutral-200 h-2 rounded-full overflow-hidden">
                                                <div
                                                    className="bg-accent-orange h-full"
                                                    style={{
                                                        width: `${item.percentage}%`,
                                                    }}
                                                />
                                            </div>
                                            <span className="text-sm w-12 text-right">
                                                {item.percentage}%
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "details" && (
                        <div>
                            {/* HARD CODED - Product Details */}
                            <h3 className="text-xl font-bold mb-4">
                                Product Details
                            </h3>
                            <div className="space-y-3 ">
                                <p>
                                    <span className="font-semibold">
                                        Department:
                                    </span>{" "}
                                    {product.category || "Hot"}
                                </p>
                                <p>
                                    <span className="font-semibold">Unit:</span>{" "}
                                    KG
                                </p>
                                <p>
                                    <span className="font-semibold">Rate:</span>{" "}
                                    <span className="text-green-600">90%</span>
                                </p>
                                {product.ingredients &&
                                    product.ingredients.length > 0 && (
                                        <div>
                                            <p className="font-semibold mb-2">
                                                Ingredients:
                                            </p>
                                            <ul className="list-disc list-inside ml-4">
                                                {product.ingredients.map(
                                                    (ingredient, idx) => (
                                                        <li key={idx}>
                                                            {ingredient}
                                                        </li>
                                                    ),
                                                )}
                                            </ul>
                                        </div>
                                    )}
                                {product.allergens &&
                                    product.allergens.length > 0 && (
                                        <div>
                                            <p className="font-semibold mb-2">
                                                Allergens:
                                            </p>
                                            <ul className="list-disc list-inside ml-4">
                                                {product.allergens.map(
                                                    (allergen, idx) => (
                                                        <li key={idx}>
                                                            {allergen}
                                                        </li>
                                                    ),
                                                )}
                                            </ul>
                                        </div>
                                    )}
                                <div>
                                    <p className="font-semibold mb-2">
                                        Features:
                                    </p>
                                    <ul className="list-disc list-inside ml-4 space-y-1">
                                        {productDescription.features.map(
                                            (feature, idx) => (
                                                <li key={idx}>{feature}</li>
                                            ),
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Our Related Items */}
                {relatedProducts.length > 0 && (
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold">
                                Our Related Item
                            </h2>
                            <div className="flex gap-2">
                                <button className="w-10 h-10 flex items-center justify-center border border-neutral-300 rounded hover:bg-neutral-100">
                                    ←
                                </button>
                                <button className="w-10 h-10 flex items-center justify-center bg-primary text-white rounded hover:bg-primary-75">
                                    →
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {relatedProducts.slice(0, 3).map((p) => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}

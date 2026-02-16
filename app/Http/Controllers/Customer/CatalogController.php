<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CatalogController extends Controller
{
    public function landing(): Response
    {
        // Get 6 featured products from different categories
        $featuredProducts = Product::with(['bakery'])
            ->where('is_available', true)
            ->where('is_featured', true)
            ->limit(6)
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'slug' => $product->slug,
                    'description' => $product->description,
                    'base_price' => $product->base_price,
                    'category' => $product->category,
                    'image_urls' => $product->image_urls,
                    'is_eggless' => $product->is_eggless,
                    'is_sugar_free' => $product->is_sugar_free,
                    'is_featured' => $product->is_featured,
                    'average_rating' => $product->average_rating,
                ];
            });

        // Get all unique categories
        $categories = Product::whereNotNull('category')
            ->distinct()
            ->pluck('category')
            ->take(8);

        return Inertia::render('Landing', [
            'featuredProducts' => $featuredProducts,
            'categories' => $categories,
        ]);
    }

    public function index(Request $request): Response
    {
        $query = Product::with(['bakery'])
            ->where('is_available', true);

        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%'.$request->search.'%')
                    ->orWhere('description', 'like', '%'.$request->search.'%');
            });
        }

        if ($request->boolean('is_eggless')) {
            $query->where('is_eggless', true);
        }

        if ($request->boolean('is_sugar_free')) {
            $query->where('is_sugar_free', true);
        }

        $products = $query->paginate(12)->withQueryString();

        $products->getCollection()->transform(function ($product) {
            $product->average_rating = round($product->reviews()->avg('rating') ?? 0, 1);
            return $product;
        });

        return Inertia::render('Products/Index', [
            'products' => $products,
            'filters' => $request->only(['category', 'search', 'is_eggless', 'is_sugar_free']),
            'categories' => Product::whereNotNull('category')->distinct()->pluck('category'),
        ]);
    }

    public function show(string $slug): Response
    {
        $product = Product::with(['bakery', 'reviews' => fn ($q) => $q->with('user')])
            ->where('slug', $slug)
            ->firstOrFail();

        $product->average_rating = round($product->reviews()->avg('rating') ?? 0, 1);
        $product->review_count = $product->reviews()->count();

        $relatedProducts = Product::where('category', $product->category)
            ->where('id', '!=', $product->id)
            ->where('is_available', true)
            ->limit(4)
            ->get();

        return Inertia::render('Products/Show', [
            'product' => $product,
            'relatedProducts' => $relatedProducts,
        ]);
    }
}

<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(): Response
    {
        $bakery = auth()->user()->bakery;

        if (! $bakery) {
            return Inertia::render('Owner/Bakery/Create');
        }

        $products = Product::where('bakery_id', $bakery->id)->latest()->paginate(12);

        return Inertia::render('Owner/Products/Index', [
            'products' => $products,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Owner/Products/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $bakery = auth()->user()->bakery;
        if (! $bakery) {
            return redirect()->route('owner.bakery.create');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'required|string|max:100',
            'base_flavor' => 'nullable|string|max:100',
            'available_sizes' => 'required|array',
            'available_sizes.*.kg' => 'required|numeric',
            'available_sizes.*.price' => 'required|numeric',
            'available_sizes.*.serves' => 'required|integer',
            'base_price' => 'required|numeric',
            'image_urls' => 'required|array',
            'image_urls.*' => 'string',
            'ingredients' => 'nullable|array',
            'allergens' => 'nullable|array',
            'is_eggless' => 'boolean',
            'is_sugar_free' => 'boolean',
            'customization_options' => 'nullable|array',
            'stock_quantity' => 'required|integer',
            'preparation_time_hours' => 'required|integer',
            'is_available' => 'boolean',
            'is_featured' => 'boolean',
        ]);

        $validated['bakery_id'] = $bakery->id;
        $validated['slug'] = Str::slug($validated['name']);
        $validated['is_available'] = $validated['is_available'] ?? true;
        $validated['is_featured'] = $validated['is_featured'] ?? false;
        $validated['is_eggless'] = $validated['is_eggless'] ?? false;
        $validated['is_sugar_free'] = $validated['is_sugar_free'] ?? false;

        Product::create($validated);

        return redirect()->route('owner.products.index')->with('success', 'Product created successfully');
    }

    public function edit(Product $product): Response|RedirectResponse
    {
        $bakery = auth()->user()->bakery;
        if (! $bakery || $product->bakery_id !== $bakery->id) {
            abort(403);
        }

        return Inertia::render('Owner/Products/Edit', [
            'product' => $product,
        ]);
    }

    public function update(Request $request, Product $product): RedirectResponse
    {
        $bakery = auth()->user()->bakery;
        if (! $bakery || $product->bakery_id !== $bakery->id) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'required|string|max:100',
            'base_flavor' => 'nullable|string|max:100',
            'available_sizes' => 'required|array',
            'base_price' => 'required|numeric',
            'image_urls' => 'required|array',
            'ingredients' => 'nullable|array',
            'allergens' => 'nullable|array',
            'is_eggless' => 'boolean',
            'is_sugar_free' => 'boolean',
            'is_available' => 'boolean',
            'is_featured' => 'boolean',
            'stock_quantity' => 'required|integer',
            'preparation_time_hours' => 'required|integer',
        ]);

        $validated['slug'] = Str::slug($validated['name']);
        $product->update($validated);

        return redirect()->route('owner.products.index')->with('success', 'Product updated successfully');
    }

    public function destroy(Product $product): RedirectResponse
    {
        $bakery = auth()->user()->bakery;
        if (! $bakery || $product->bakery_id !== $bakery->id) {
            abort(403);
        }

        $product->delete();

        return redirect()->route('owner.products.index')->with('success', 'Product deleted successfully');
    }
}

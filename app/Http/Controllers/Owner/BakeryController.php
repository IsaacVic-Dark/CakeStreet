<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use App\Models\Bakery;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class BakeryController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Owner/Bakery/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email',
            'address' => 'nullable|string',
            'city' => 'nullable|string|max:100',
            'country' => 'nullable|string|max:100',
        ]);

        $validated['owner_id'] = auth()->id();
        $validated['slug'] = Str::slug($validated['name']).'-'.substr(uniqid(), -4);
        $validated['is_active'] = true;

        Bakery::create($validated);

        return redirect()->route('owner.dashboard')->with('success', 'Bakery created successfully');
    }

    public function edit(Bakery $bakery): Response|RedirectResponse
    {
        if ($bakery->owner_id !== auth()->id()) {
            abort(403);
        }

        return Inertia::render('Owner/Bakery/Edit', [
            'bakery' => $bakery,
        ]);
    }

    public function update(Request $request, Bakery $bakery): RedirectResponse
    {
        if ($bakery->owner_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email',
            'address' => 'nullable|string',
            'city' => 'nullable|string|max:100',
            'country' => 'nullable|string|max:100',
            'is_active' => 'boolean',
        ]);

        $bakery->update($validated);

        return redirect()->route('owner.dashboard')->with('success', 'Bakery updated successfully');
    }
}

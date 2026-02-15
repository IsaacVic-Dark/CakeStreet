<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\CakeDesign;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CakeDesignerController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Designer/Edit', [
            'design' => null,
        ]);
    }

    public function index(): Response
    {
        $userDesigns = CakeDesign::where('user_id', auth()->id())
            ->latest()
            ->get();

        $templates = CakeDesign::where('is_template', true)
            ->where('is_public', true)
            ->get();

        return Inertia::render('Designer/Index', [
            'userDesigns' => $userDesigns,
            'templates' => $templates,
        ]);
    }

    public function save(Request $request): RedirectResponse|\Illuminate\Http\JsonResponse
    {
        $validated = $request->validate([
            'name' => 'nullable|string|max:255',
            'design_data' => 'required|array',
            'preview_image_url' => 'nullable|string',
            'is_template' => 'boolean',
        ]);

        $design = CakeDesign::create([
            'user_id' => auth()->id(),
            'name' => $validated['name'] ?? 'Untitled Design',
            'design_data' => $validated['design_data'],
            'preview_image_url' => $validated['preview_image_url'] ?? null,
            'is_template' => $validated['is_template'] ?? false,
            'status' => 'draft',
        ]);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'design' => $design,
            ]);
        }

        return back()->with('success', 'Design saved.');
    }

    public function edit(CakeDesign $design): Response
    {
        if ($design->user_id !== auth()->id()) {
            abort(403);
        }

        return Inertia::render('Designer/Edit', [
            'design' => $design,
        ]);
    }
}

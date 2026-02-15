<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CakeDesignController extends Controller
{
    public function export(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'design_data' => 'nullable|array',
            'design_id' => 'nullable|exists:cake_designs,id',
        ]);

        // Stub: in production, generate image from design_data or load design and return URL/base64
        return response()->json([
            'success' => true,
            'image_url' => null,
            'message' => 'Export not implemented. Use preview from designer.',
        ]);
    }
}

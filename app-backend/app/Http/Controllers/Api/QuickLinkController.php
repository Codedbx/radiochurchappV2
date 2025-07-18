<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\QuickLink;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class QuickLinkController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $quickLinks = QuickLink::active()
            ->byPriority()
            ->get();

        // Add image URLs
        $quickLinks->transform(function ($link) {
            $link->image_url = $link->image_url;
            $link->image_thumb_url = $link->image_thumb_url;
            return $link;
        });

        return response()->json([
            'data' => $quickLinks
        ]);
    }
}
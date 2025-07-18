<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\StreamLink;
use App\Models\Metric;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class StreamLinkController extends Controller
{
    public function getActive(Request $request): JsonResponse
    {
        $activeStream = StreamLink::getActiveStream();

        if (!$activeStream) {
            return response()->json([
                'data' => null,
                'message' => 'No active stream available'
            ]);
        }

        // Track stream view
        Metric::track('visit', $request->user(), $activeStream);

        return response()->json([
            'data' => [
                'id' => $activeStream->id,
                'name' => $activeStream->name,
                'url' => $activeStream->url,
                'is_active' => $activeStream->is_active,
            ]
        ]);
    }
}

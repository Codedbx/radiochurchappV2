<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PodcastRequest;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class PodcastRequestController extends Controller
{
    public function myRequests(Request $request): JsonResponse
    {
        $requests = PodcastRequest::where('user_id', $request->user()->id)
            ->latest('created_at')
            ->get();

        return response()->json([
            'data' => $requests
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        // Check if user already has an approved request
        if ($request->user()->canUploadPodcasts()) {
            return response()->json([
                'message' => 'You already have podcast upload privileges'
            ], 422);
        }

        // Check if user has a pending request
        $existingRequest = PodcastRequest::where('user_id', $request->user()->id)
            ->where('status', 'pending')
            ->first();

        if ($existingRequest) {
            return response()->json([
                'message' => 'You already have a pending podcast request'
            ], 422);
        }

        $validator = Validator::make($request->all(), [
            'reason' => 'required|string|max:1000',
            'note_to_admin' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $podcastRequest = PodcastRequest::create([
            'user_id' => $request->user()->id,
            'reason' => $request->reason,
            'note_to_admin' => $request->note_to_admin,
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Podcast request submitted successfully',
            'data' => $podcastRequest
        ], 201);
    }
}
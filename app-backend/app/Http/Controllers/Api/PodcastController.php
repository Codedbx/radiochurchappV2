<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Podcast;
use App\Models\Metric;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class PodcastController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Podcast::with(['user:id,name', 'media'])
            ->published()
            ->latest('published_at');

        // Apply filters
        if ($request->has('search')) {
            $query->search($request->search);
        }

        if ($request->has('sort')) {
            match($request->sort) {
                'popular' => $query->popular(),
                'recent' => $query->recent(),
                default => $query->recent()
            };
        }

        $podcasts = $query->paginate($request->get('per_page', 15));

        // Add computed fields
        $podcasts->getCollection()->transform(function ($podcast) use ($request) {
            $podcast->is_favourited = $podcast->isFavouritedBy($request->user());
            $podcast->comments_count = $podcast->approved_comments_count;
            $podcast->favourites_count = $podcast->favourites_count;
            return $podcast;
        });

        return response()->json([
            'data' => $podcasts->items(),
            'pagination' => [
                'current_page' => $podcasts->currentPage(),
                'last_page' => $podcasts->lastPage(),
                'per_page' => $podcasts->perPage(),
                'total' => $podcasts->total(),
            ]
        ]);
    }

    public function show(Request $request, Podcast $podcast): JsonResponse
    {
        if (!$podcast->is_published || $podcast->is_delete_requested) {
            return response()->json(['message' => 'Podcast not found'], 404);
        }

        $podcast->load(['user:id,name', 'media']);
        
        // Track view metric
        Metric::track('visit', $request->user(), $podcast);

        // Add computed fields
        $podcast->is_favourited = $podcast->isFavouritedBy($request->user());
        $podcast->comments_count = $podcast->approved_comments_count;
        $podcast->favourites_count = $podcast->favourites_count;

        return response()->json(['data' => $podcast]);
    }

    public function myPodcasts(Request $request): JsonResponse
    {
        // Check if user can upload podcasts
        if (!$request->user()->canUploadPodcasts()) {
            return response()->json(['message' => 'Podcast upload not approved'], 403);
        }

        $query = Podcast::with('media')
            ->byUser($request->user()->id)
            ->latest('created_at');

        // Apply filters
        if ($request->has('status')) {
            match($request->status) {
                'pending' => $query->pending(),
                'approved' => $query->approved(),
                'rejected' => $query->rejected(),
                default => $query
            };
        }

        if ($request->has('search')) {
            $query->search($request->search);
        }

        $podcasts = $query->paginate($request->get('per_page', 15));

        // Add computed fields and permissions
        $podcasts->getCollection()->transform(function ($podcast) {
            $podcast->can_edit = $podcast->canEdit();
            $podcast->can_delete = $podcast->canDelete();
            $podcast->is_delete_requested = $podcast->isDeleteRequested();
            $podcast->comments_count = $podcast->approved_comments_count;
            $podcast->favourites_count = $podcast->favourites_count;
            return $podcast;
        });

        return response()->json([
            'data' => $podcasts->items(),
            'pagination' => [
                'current_page' => $podcasts->currentPage(),
                'last_page' => $podcasts->lastPage(),
                'per_page' => $podcasts->perPage(),
                'total' => $podcasts->total(),
            ]
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        // Check if user can upload podcasts
        if (!$request->user()->canUploadPodcasts()) {
            return response()->json(['message' => 'Podcast upload not approved'], 403);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:5000',
            'audio_file' => 'required|file|mimes:mp3,wav,ogg|max:51200', // 50MB max
            'cover_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120', // 5MB max
            'allow_download' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Create podcast
        $podcast = Podcast::create([
            'user_id' => $request->user()->id,
            'title' => $request->title,
            'description' => $request->description,
            'allow_download' => $request->boolean('allow_download', true),
            'status' => 'pending',
            'is_published' => false,
        ]);

        // Handle file uploads
        if ($request->hasFile('audio_file')) {
            $podcast->addMediaFromRequest('audio_file')
                ->toMediaCollection('audio_file');
        }

        if ($request->hasFile('cover_image')) {
            $podcast->addMediaFromRequest('cover_image')
                ->toMediaCollection('cover_image');
        }

        $podcast->load('media');
        $podcast->can_edit = $podcast->canEdit();
        $podcast->can_delete = $podcast->canDelete();

        return response()->json([
            'message' => 'Podcast uploaded successfully and pending approval',
            'data' => $podcast
        ], 201);
    }

    public function update(Request $request, Podcast $podcast): JsonResponse
    {
        // Check ownership
        if ($podcast->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Check if can edit
        if (!$podcast->canEdit()) {
            return response()->json(['message' => 'Cannot edit approved podcast'], 403);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string|max:5000',
            'audio_file' => 'sometimes|file|mimes:mp3,wav,ogg|max:51200',
            'cover_image' => 'sometimes|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'allow_download' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Update podcast fields
        $podcast->update($request->only(['title', 'description', 'allow_download']));

        // Handle file uploads
        if ($request->hasFile('audio_file')) {
            $podcast->clearMediaCollection('audio_file');
            $podcast->addMediaFromRequest('audio_file')
                ->toMediaCollection('audio_file');
        }

        if ($request->hasFile('cover_image')) {
            $podcast->clearMediaCollection('cover_image');
            $podcast->addMediaFromRequest('cover_image')
                ->toMediaCollection('cover_image');
        }

        $podcast->load('media');
        $podcast->can_edit = $podcast->canEdit();
        $podcast->can_delete = $podcast->canDelete();

        return response()->json([
            'message' => 'Podcast updated successfully',
            'data' => $podcast
        ]);
    }

    public function destroy(Request $request, Podcast $podcast): JsonResponse
    {
        // Check ownership
        if ($podcast->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Check if can delete
        if (!$podcast->canDelete()) {
            return response()->json(['message' => 'Deletion already requested'], 403);
        }

        $validator = Validator::make($request->all(), [
            'reason' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // If not approved yet, delete immediately
        if ($podcast->status === 'pending' || $podcast->status === 'rejected') {
            $podcast->delete();
            return response()->json([
                'message' => 'Podcast deleted successfully'
            ]);
        }

        // If approved, request deletion
        $podcast->requestDeletion($request->reason);

        return response()->json([
            'message' => 'Deletion request submitted for admin approval'
        ]);
    }

    public function listen(Request $request, Podcast $podcast): JsonResponse
    {
        if (!$podcast->is_published || $podcast->is_delete_requested) {
            return response()->json(['message' => 'Podcast not found'], 404);
        }

        // Increment listen count
        $podcast->incrementListens();

        // Track listen metric
        Metric::track('podcast_listen', $request->user(), $podcast);

        return response()->json([
            'message' => 'Listen tracked',
            'listens' => $podcast->fresh()->listens
        ]);
    }

    public function download(Request $request, Podcast $podcast): JsonResponse
    {
        if (!$podcast->is_published || !$podcast->allow_download || $podcast->is_delete_requested) {
            return response()->json(['message' => 'Download not available'], 403);
        }

        $audioUrl = $podcast->audio_file_url;
        
        if (!$audioUrl) {
            return response()->json(['message' => 'Audio file not found'], 404);
        }

        // Track download metric
        Metric::track('podcast_listen', $request->user(), $podcast, ['action' => 'download']);

        return response()->json([
            'download_url' => $audioUrl,
            'filename' => $podcast->title . '.mp3'
        ]);
    }
}

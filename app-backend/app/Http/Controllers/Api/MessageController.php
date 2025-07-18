<?php

namespace App\Http\Controllers\Api;

use App\Models\Message;
use App\Http\Requests\StoreMessageRequest;
use App\Http\Requests\UpdateMessageRequest;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\Metric;

class MessageController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Message::with(['category', 'media'])
            ->published()
            ->latest('published_at');

        // Apply filters
        if ($request->has('category')) {
            $query->byCategory($request->category);
        }

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

        $messages = $query->paginate($request->get('per_page', 15));

        // Add computed fields
        $messages->getCollection()->transform(function ($message) use ($request) {
            $message->is_favourited = $message->isFavouritedBy($request->user());
            $message->comments_count = $message->approved_comments_count;
            $message->favourites_count = $message->favourites_count;
            return $message;
        });

        return response()->json([
            'data' => $messages->items(),
            'pagination' => [
                'current_page' => $messages->currentPage(),
                'last_page' => $messages->lastPage(),
                'per_page' => $messages->perPage(),
                'total' => $messages->total(),
            ]
        ]);
    }

    public function show(Request $request, Message $message): JsonResponse
    {
        if (!$message->is_published) {
            return response()->json(['message' => 'Message not found'], 404);
        }

        $message->load(['category', 'media']);
        
        // Track view metric
        Metric::track('visit', $request->user(), $message);

        // Add computed fields
        $message->is_favourited = $message->isFavouritedBy($request->user());
        $message->comments_count = $message->approved_comments_count;
        $message->favourites_count = $message->favourites_count;

        return response()->json(['data' => $message]);
    }

    public function listen(Request $request, Message $message): JsonResponse
    {
        if (!$message->is_published) {
            return response()->json(['message' => 'Message not found'], 404);
        }

        // Increment listen count
        $message->incrementListens();

        // Track listen metric
        Metric::track('message_listen', $request->user(), $message);

        return response()->json([
            'message' => 'Listen tracked',
            'listens' => $message->fresh()->listens
        ]);
    }

    public function download(Request $request, Message $message): JsonResponse
    {
        if (!$message->is_published || !$message->allow_download) {
            return response()->json(['message' => 'Download not available'], 403);
        }

        $audioUrl = $message->audio_file_url;
        
        if (!$audioUrl) {
            return response()->json(['message' => 'Audio file not found'], 404);
        }

        // Track download metric
        Metric::track('message_listen', $request->user(), $message, ['action' => 'download']);

        return response()->json([
            'download_url' => $audioUrl,
            'filename' => $message->title . '.mp3'
        ]);
    }
}

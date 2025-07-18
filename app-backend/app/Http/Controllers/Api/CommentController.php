<?php

namespace App\Http\Controllers\Api;


use App\Http\Controllers\Controller;
use App\Models\Comment;
use App\Models\StreamLink;
use App\Models\Message;
use App\Models\Podcast;
use App\Models\Metric;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class CommentController extends Controller
{
    public function getStreamComments(Request $request): JsonResponse
    {
        $activeStream = StreamLink::getActiveStream();
        
        if (!$activeStream) {
            return response()->json(['data' => []]);
        }

        $comments = $activeStream->comments()
            ->with('user:id,name')
            ->approved()
            ->recent()
            ->paginate(20);

        return response()->json([
            'data' => $comments->items(),
            'pagination' => [
                'current_page' => $comments->currentPage(),
                'last_page' => $comments->lastPage(),
                'per_page' => $comments->perPage(),
                'total' => $comments->total(),
            ]
        ]);
    }

    public function getMessageComments(Request $request, Message $message): JsonResponse
    {
        if (!$message->is_published) {
            return response()->json(['message' => 'Message not found'], 404);
        }

        $comments = $message->comments()
            ->with('user:id,name')
            ->approved()
            ->recent()
            ->paginate(20);

        return response()->json([
            'data' => $comments->items(),
            'pagination' => [
                'current_page' => $comments->currentPage(),
                'last_page' => $comments->lastPage(),
                'per_page' => $comments->perPage(),
                'total' => $comments->total(),
            ]
        ]);
    }

    public function getPodcastComments(Request $request, Podcast $podcast): JsonResponse
    {
        if (!$podcast->is_published || $podcast->is_delete_requested) {
            return response()->json(['message' => 'Podcast not found'], 404);
        }

        $comments = $podcast->comments()
            ->with('user:id,name')
            ->approved()
            ->recent()
            ->paginate(20);

        return response()->json([
            'data' => $comments->items(),
            'pagination' => [
                'current_page' => $comments->currentPage(),
                'last_page' => $comments->lastPage(),
                'per_page' => $comments->perPage(),
                'total' => $comments->total(),
            ]
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'body' => 'required|string|max:1000',
            'commentable_type' => 'required|in:stream,message,podcast',
            'commentable_id' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Map commentable_type to actual model class
        $commentableClass = match($request->commentable_type) {
            'stream' => StreamLink::class,
            'message' => Message::class,
            'podcast' => Podcast::class,
        };

        // Verify the commentable exists and is accessible
        $commentable = $commentableClass::find($request->commentable_id);
        
        if (!$commentable) {
            return response()->json(['message' => 'Resource not found'], 404);
        }

        // Additional checks for specific types
        if ($commentable instanceof Message && !$commentable->is_published) {
            return response()->json(['message' => 'Message not available for comments'], 403);
        }

        if ($commentable instanceof Podcast && (!$commentable->is_published || $commentable->is_delete_requested)) {
            return response()->json(['message' => 'Podcast not available for comments'], 403);
        }

        if ($commentable instanceof StreamLink && !$commentable->is_active) {
            return response()->json(['message' => 'Stream not active'], 403);
        }

        // Create comment
        $comment = Comment::create([
            'user_id' => $request->user()->id,
            'commentable_type' => $commentableClass,
            'commentable_id' => $commentable->id,
            'body' => $request->body,
            'approved' => false, // Comments need approval
        ]);

        $comment->load('user:id,name');

        // Track comment metric
        Metric::track('comment', $request->user(), $commentable);

        return response()->json([
            'message' => 'Comment submitted for approval',
            'data' => $comment
        ], 201);
    }

    public function update(Request $request, Comment $comment): JsonResponse
    {
        // Users can only edit their own comments and only if not approved yet
        if ($comment->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($comment->approved) {
            return response()->json(['message' => 'Cannot edit approved comments'], 403);
        }

        $validator = Validator::make($request->all(), [
            'body' => 'required|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $comment->update([
            'body' => $request->body,
            'approved' => false, // Reset approval status
        ]);

        $comment->load('user:id,name');

        return response()->json([
            'message' => 'Comment updated',
            'data' => $comment
        ]);
    }

    public function destroy(Request $request, Comment $comment): JsonResponse
    {
        // Users can only delete their own comments
        if ($comment->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $comment->delete();

        return response()->json([
            'message' => 'Comment deleted'
        ]);
    }
}

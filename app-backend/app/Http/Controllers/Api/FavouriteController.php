<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Favourite;
use App\Models\Message;
use App\Models\Podcast;
use App\Models\Metric;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class FavouriteController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Favourite::with(['favouritable'])
            ->where('user_id', $request->user()->id)
            ->latest('created_at');

        // Apply filters
        if ($request->has('type')) {
            $type = match($request->type) {
                'messages' => Message::class,
                'podcasts' => Podcast::class,
                default => null
            };
            
            if ($type) {
                $query->where('favouritable_type', $type);
            }
        }

        $favourites = $query->paginate($request->get('per_page', 15));

        // Transform the data to include favouritable details
        $favourites->getCollection()->transform(function ($favourite) {
            $item = $favourite->favouritable;
            
            if ($item) {
                $item->load('media');
                $item->favourited_at = $favourite->created_at;
                $item->favourite_id = $favourite->id;
                $item->type = $favourite->favouritable_type === Message::class ? 'message' : 'podcast';
                
                // Add user info for podcasts
                if ($item instanceof Podcast) {
                    $item->load('user:id,name');
                }
                
                // Add category info for messages
                if ($item instanceof Message) {
                    $item->load('category:id,name');
                }
            }
            
            return $item;
        })->filter(); // Remove any null items

        return response()->json([
            'data' => $favourites->items(),
            'pagination' => [
                'current_page' => $favourites->currentPage(),
                'last_page' => $favourites->lastPage(),
                'per_page' => $favourites->perPage(),
                'total' => $favourites->total(),
            ]
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'favouritable_type' => 'required|in:message,podcast',
            'favouritable_id' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Map type to class
        $favouritableClass = match($request->favouritable_type) {
            'message' => Message::class,
            'podcast' => Podcast::class,
        };

        // Verify the item exists and is accessible
        $favouritable = $favouritableClass::find($request->favouritable_id);
        
        if (!$favouritable) {
            return response()->json(['message' => 'Resource not found'], 404);
        }

        // Additional checks
        if ($favouritable instanceof Message && !$favouritable->is_published) {
            return response()->json(['message' => 'Message not available'], 403);
        }

        if ($favouritable instanceof Podcast && (!$favouritable->is_published || $favouritable->is_delete_requested)) {
            return response()->json(['message' => 'Podcast not available'], 403);
        }

        // Check if already favourited
        $existingFavourite = Favourite::where([
            'user_id' => $request->user()->id,
            'favouritable_type' => $favouritableClass,
            'favouritable_id' => $favouritable->id,
        ])->first();

        if ($existingFavourite) {
            return response()->json(['message' => 'Already favourited'], 422);
        }

        // Create favourite
        $favourite = Favourite::create([
            'user_id' => $request->user()->id,
            'favouritable_type' => $favouritableClass,
            'favouritable_id' => $favouritable->id,
        ]);

        // Track favourite metric
        Metric::track('favourite', $request->user(), $favouritable);

        return response()->json([
            'message' => 'Added to favourites',
            'data' => $favourite
        ], 201);
    }

    public function destroy(Request $request, Favourite $favourite): JsonResponse
    {
        // Check ownership
        if ($favourite->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $favourite->delete();

        return response()->json([
            'message' => 'Removed from favourites'
        ]);
    }

//     public function toggleMessage(Request $request, Message $message): JsonResponse
//     {
//         if (!$message->is_published) {
//             return response()->json(['message' => 'Message not available'], 403);
//         }

//         $favourite = Favourite::where([
//             'user_id' => $request->user()->id,
//             'favouritable_type' => Message::class,
//             'favouritable_id' => $message->id,
//         ])->first();

//         if ($favourite) {
//             $favourite->delete();
//             return response()->json([
//                 'message' => 'Removed from favourites',
//                 'is_favourited' => false
//             ]);
//         } else {
//             Favourite::create([
//                 'user_id' => $request->user()->id,
//                 'favouritable_type' => Message::class,
//                 'favouritable_id' => $message->id,
//             ]);

//             // Track favourite metric
//             Metric::track('favourite', $request->user(), $message);

//             return response()->json([
//                 'message' => 'Added to favourites',
//                 'is_favourited' => true
//             ]);
//         }
//     }


//     public function togglePodcast(Request $request, Podcast $podcast): JsonResponse
//     {
//         if (!$podcast->is_published || $podcast->is_delete_requested) {
//             return response()->json(['message' => 'Podcast not available'], 403);
//         }

//         $favourite = Favourite::where([
//             'user_id' => $request->user()->id,
//             'favouritable_type' => Podcast::class,
//             'favouritable_id' => $podcast->id,
//         ])->first();

//         if ($favourite) {
//             $favourite->delete();
//             return response()->json([
//                 'message' => 'Removed from favourites',
//                 'is_favourited' => false
//             ]);
//         } else {
//             Favourite::create([
//                 'user_id' => $request->user()->id,
//                 'favouritable_type' => Podcast::class,
//                 'favouritable_id' => $podcast->id,
//             ]);

//             // Track favourite metric
//             Metric::track('favourite', $request->user(), $podcast);

//             return response()->json([
//                 'message' => 'Added to favourites',
//                 'is_favourited' => true
//             ]);
//         }
//     }
}
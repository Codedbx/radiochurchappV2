<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CategoryController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $categories = Category::withCount(['messages' => function ($query) {
            $query->published();
        }])
        ->orderBy('name')
        ->get();

        // Add image URLs and messages count
        $categories->transform(function ($category) {
            return [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'description' => $category->description,
                'image_url' => $category->image_url,
                'image_thumb_url' => $category->image_thumb_url,
                'image_small_url' => $category->image_small_url,
                'messages_count' => $category->messages_count,
                'created_at' => $category->created_at,
                'updated_at' => $category->updated_at,
            ];
        });

        return response()->json([
            'data' => $categories
        ]);
    }

    public function show(Request $request, Category $category): JsonResponse
    {
        $category->loadCount(['messages' => function ($query) {
            $query->published();
        }]);

        // Get recent messages in this category
        $recentMessages = $category->messages()
            ->published()
            ->with('media')
            ->latest('published_at')
            ->limit(10)
            ->get();

        $categoryData = [
            'id' => $category->id,
            'name' => $category->name,
            'slug' => $category->slug,
            'description' => $category->description,
            'image_url' => $category->image_url,
            'image_thumb_url' => $category->image_thumb_url,
            'image_small_url' => $category->image_small_url,
            'messages_count' => $category->messages_count,
            'recent_messages' => $recentMessages->map(function ($message) use ($request) {
                return [
                    'id' => $message->id,
                    'title' => $message->title,
                    'description' => $message->description,
                    'cover_image_url' => $message->cover_image_url,
                    'cover_image_thumb_url' => $message->cover_image_thumb_url,
                    'listens' => $message->listens,
                    'is_favourited' => $message->isFavouritedBy($request->user()),
                    'published_at' => $message->published_at,
                ];
            }),
            'created_at' => $category->created_at,
            'updated_at' => $category->updated_at,
        ];

        return response()->json([
            'data' => $categoryData
        ]);
    }
}
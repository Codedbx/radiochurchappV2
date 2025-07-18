<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Metric;
use App\Models\Message;
use App\Models\Podcast;
use App\Models\StreamLink;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class MetricController extends Controller
{
    public function track(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'type' => 'required|in:visit,message_listen,podcast_listen,comment,favourite',
            'entity_type' => 'nullable|in:message,podcast,stream',
            'entity_id' => 'nullable|integer',
            'metadata' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $entity = null;
        if ($request->entity_type && $request->entity_id) {
            $entityClass = match($request->entity_type) {
                'message' => Message::class,
                'podcast' => Podcast::class,
                'stream' => StreamLink::class,
                default => null
            };

            if ($entityClass) {
                $entity = $entityClass::find($request->entity_id);
            }
        }

        Metric::track(
            $request->type,
            $request->user(),
            $entity,
            $request->metadata ?? []
        );

        return response()->json([
            'message' => 'Metric tracked successfully'
        ]);
    }

    public function userAnalytics(Request $request): JsonResponse
    {
        $user = $request->user();
        $period = $request->get('period', 'month');

        $analytics = [
            'listens' => [
                'messages' => Metric::where('user_id', $user->id)
                    ->where('type', 'message_listen')
                    ->when($period === 'week', fn($q) => $q->thisWeek())
                    ->when($period === 'month', fn($q) => $q->thisMonth())
                    ->count(),
                'podcasts' => Metric::where('user_id', $user->id)
                    ->where('type', 'podcast_listen')
                    ->when($period === 'week', fn($q) => $q->thisWeek())
                    ->when($period === 'month', fn($q) => $q->thisMonth())
                    ->count(),
            ],
            'activity' => [
                'comments' => Metric::where('user_id', $user->id)
                    ->where('type', 'comment')
                    ->when($period === 'week', fn($q) => $q->thisWeek())
                    ->when($period === 'month', fn($q) => $q->thisMonth())
                    ->count(),
                'favourites' => Metric::where('user_id', $user->id)
                    ->where('type', 'favourite')
                    ->when($period === 'week', fn($q) => $q->thisWeek())
                    ->when($period === 'month', fn($q) => $q->thisMonth())
                    ->count(),
            ],
            'favourites_count' => $user->favourites()->count(),
            'podcast_upload_approved' => $user->canUploadPodcasts(),
        ];

        if ($user->canUploadPodcasts()) {
            $analytics['my_podcasts'] = [
                'total' => $user->podcasts()->count(),
                'approved' => $user->podcasts()->approved()->count(),
                'pending' => $user->podcasts()->pending()->count(),
                'total_listens' => $user->podcasts()->sum('listens'),
            ];
        }

        return response()->json([
            'data' => $analytics,
            'period' => $period
        ]);
    }

    public function adminAnalytics(Request $request): JsonResponse
    {
        $period = $request->get('period', 'month');
        $analytics = Metric::getAnalytics($period);

        return response()->json([
            'data' => $analytics,
            'period' => $period
        ]);
    }

    public function dashboardStats(Request $request): JsonResponse
    {
        $stats = [
            'total_users' => \App\Models\User::count(),
            'total_messages' => Message::published()->count(),
            'total_podcasts' => Podcast::published()->count(),
            'pending_podcasts' => Podcast::pending()->count(),
            'pending_comments' => \App\Models\Comment::pending()->count(),
            'pending_podcast_requests' => \App\Models\PodcastRequest::pending()->count(),
            'active_stream' => StreamLink::getActiveStream()?->name ?? 'None',
        ];

        // Recent activity
        $recentActivity = [
            'recent_comments' => \App\Models\Comment::with(['user:id,name', 'commentable'])
                ->latest()
                ->limit(5)
                ->get(),
            'recent_podcasts' => Podcast::with(['user:id,name'])
                ->pending()
                ->latest()
                ->limit(5)
                ->get(),
            'recent_users' => \App\Models\User::latest()
                ->limit(5)
                ->get(['id', 'name', 'email', 'created_at']),
        ];

        return response()->json([
            'stats' => $stats,
            'recent_activity' => $recentActivity
        ]);
    }
}
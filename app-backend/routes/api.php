<?php


// routes/api.php - Complete version
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\GoogleAuthController;
use App\Http\Controllers\Api\StreamLinkController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\PodcastController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\QuickLinkController;
use App\Http\Controllers\Api\BannerAdController;
use App\Http\Controllers\Api\FavouriteController;
use App\Http\Controllers\Api\MetricController;
use App\Http\Controllers\Api\PodcastRequestController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Google OAuth routes
Route::get('/auth/google', [GoogleAuthController::class, 'redirect']);
Route::get('/auth/google/callback', [GoogleAuthController::class, 'callback']);
Route::post('/auth/google/token', [GoogleAuthController::class, 'handleProviderCallback']);

// Public content routes
Route::get('/stream/active', [StreamLinkController::class, 'getActive']);
Route::get('/messages', [MessageController::class, 'index']);
Route::get('/messages/{message}', [MessageController::class, 'show']);
Route::post('/messages/{message}/listen', [MessageController::class, 'listen']);
Route::get('/podcasts', [PodcastController::class, 'index']);
Route::get('/podcasts/{podcast}', [PodcastController::class, 'show']);
Route::post('/podcasts/{podcast}/listen', [PodcastController::class, 'listen']);
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{category}', [CategoryController::class, 'show']);
Route::get('/quick-links', [QuickLinkController::class, 'index']);
Route::get('/banner-ads', [BannerAdController::class, 'index']);

// Public comments (read-only)
Route::get('/comments/stream', [CommentController::class, 'getStreamComments']);
Route::get('/comments/message/{message}', [CommentController::class, 'getMessageComments']);
Route::get('/comments/podcast/{podcast}', [CommentController::class, 'getPodcastComments']);

// Metrics tracking (can be anonymous)
Route::post('/metrics/track', [MetricController::class, 'track']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/refresh-token', [AuthController::class, 'refreshToken']);

    // Comments (authenticated users)
    Route::post('/comments', [CommentController::class, 'store']);
    Route::put('/comments/{comment}', [CommentController::class, 'update']);
    Route::delete('/comments/{comment}', [CommentController::class, 'destroy']);

    // Favourites
    Route::get('/favourites', [FavouriteController::class, 'index']);
    Route::post('/favourites', [FavouriteController::class, 'store']);
    Route::delete('/favourites/{favourite}', [FavouriteController::class, 'destroy']);
    Route::post('/messages/{message}/favourite', [FavouriteController::class, 'toggleMessage']);
    Route::post('/podcasts/{podcast}/favourite', [FavouriteController::class, 'togglePodcast']);

    // Podcast requests
    Route::get('/podcast-requests/my', [PodcastRequestController::class, 'myRequests']);
    Route::post('/podcast-requests', [PodcastRequestController::class, 'store']);

    // User podcasts (for approved users)
    Route::get('/my-podcasts', [PodcastController::class, 'myPodcasts']);
    Route::post('/podcasts', [PodcastController::class, 'store']);
    Route::put('/podcasts/{podcast}', [PodcastController::class, 'update']);
    Route::delete('/podcasts/{podcast}', [PodcastController::class, 'destroy']);

    // Download routes (with access control)
    Route::get('/messages/{message}/download', [MessageController::class, 'download']);
    Route::get('/podcasts/{podcast}/download', [PodcastController::class, 'download']);

    // User analytics
    Route::get('/my-analytics', [MetricController::class, 'userAnalytics']);
});

// Admin/Manager routes (for API access if needed)
Route::middleware(['auth:sanctum', 'role:admin|manager'])->prefix('admin')->group(function () {
    Route::get('/analytics', [MetricController::class, 'adminAnalytics']);
    Route::get('/dashboard-stats', [MetricController::class, 'dashboardStats']);
});

// Default Sanctum user route
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
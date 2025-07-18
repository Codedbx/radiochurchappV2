<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Models\PodcastRequest;
use App\Observers\PodcastRequestObserver;
use App\Models\Podcast;
use App\Observers\PodcastObserver;
use App\Models\Comment;
use App\Observers\CommentObserver;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        PodcastRequest::observe(PodcastRequestObserver::class);
        Podcast::observe(PodcastObserver::class);
        Comment::observe(CommentObserver::class);
    }
}

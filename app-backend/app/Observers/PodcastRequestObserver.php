<?php

namespace App\Observers;

use App\Models\PodcastRequest;
use App\Notifications\PodcastRequestApproved;
use App\Notifications\PodcastRequestRejected;

class PodcastRequestObserver
{
    /**
     * Handle the PodcastRequest "created" event.
     */
    public function created(PodcastRequest $podcastRequest): void
    {
        //
    }

    /**
     * Handle the PodcastRequest "updated" event.
     */
    public function updated(PodcastRequest $podcastRequest): void
    {
        if ($podcastRequest->isDirty('status') && $podcastRequest->status !== 'pending') {
            if ($podcastRequest->status === 'approved') {
                $podcastRequest->user->notify(new PodcastRequestApproved($podcastRequest));
            } elseif ($podcastRequest->status === 'rejected') {
                $podcastRequest->user->notify(new PodcastRequestRejected($podcastRequest));
            }
        }
    }

    /**
     * Handle the PodcastRequest "deleted" event.
     */
    public function deleted(PodcastRequest $podcastRequest): void
    {
        //
    }

    /**
     * Handle the PodcastRequest "restored" event.
     */
    public function restored(PodcastRequest $podcastRequest): void
    {
        //
    }

    /**
     * Handle the PodcastRequest "force deleted" event.
     */
    public function forceDeleted(PodcastRequest $podcastRequest): void
    {
        //
    }
}

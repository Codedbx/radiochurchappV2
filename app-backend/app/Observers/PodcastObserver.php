<?php

namespace App\Observers;

use App\Models\Podcast;
use App\Notifications\PodcastApproved;
use App\Notifications\PodcastRejected;

class PodcastObserver
{
    /**
     * Handle the Podcast "created" event.
     */
    public function created(Podcast $podcast): void
    {
        //
    }

    /**
     * Handle the Podcast "updated" event.
     */
    public function updated(Podcast $podcast): void
    {
        if ($podcast->isDirty('status') && $podcast->status !== 'pending') {
            if ($podcast->status === 'approved') {
                $podcast->user->notify(new PodcastApproved($podcast));
            } elseif ($podcast->status === 'rejected') {
                $podcast->user->notify(new PodcastRejected($podcast));
            }
        }
    }

    /**
     * Handle the Podcast "deleted" event.
     */
    public function deleted(Podcast $podcast): void
    {
        //
    }

    /**
     * Handle the Podcast "restored" event.
     */
    public function restored(Podcast $podcast): void
    {
        //
    }

    /**
     * Handle the Podcast "force deleted" event.
     */
    public function forceDeleted(Podcast $podcast): void
    {
        //
    }
}

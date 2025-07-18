<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\Podcast;

class PodcastApproved extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Podcast $podcast
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Podcast Approved: ' . $this->podcast->title)
            ->greeting('Congratulations!')
            ->line('Your podcast "' . $this->podcast->title . '" has been approved and is now live.')
            ->line('Listeners can now discover and enjoy your content.')
            ->action('View Podcast', url('/podcasts/' . $this->podcast->id))
            ->line('Keep up the great work!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}

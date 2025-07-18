<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\PodcastRequest;

class PodcastRequestRejected extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public PodcastRequest $podcastRequest
    ) {}

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $message = (new MailMessage)
            ->subject('Podcast Request Update')
            ->greeting('Hello!')
            ->line('We have reviewed your podcast upload request.');

        if ($this->podcastRequest->admin_note) {
            $message->line('Admin note: ' . $this->podcastRequest->admin_note);
        }

        return $message
            ->line('Unfortunately, we cannot approve your request at this time.')
            ->line('You can submit a new request if you believe this was in error.')
            ->action('Submit New Request', url('/request-podcast'))
            ->line('Thank you for your understanding.');
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

<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\Podcast;

class PodcastRejected extends Notification implements ShouldQueue
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
        $message = (new MailMessage)
            ->subject('Podcast Update: ' . $this->podcast->title)
            ->greeting('Hello!')
            ->line('We have reviewed your podcast "' . $this->podcast->title . '".');

        if ($this->podcast->admin_note) {
            $message->line('Admin feedback: ' . $this->podcast->admin_note);
        }

        return $message
            ->line('Your podcast needs some adjustments before it can be published.')
            ->line('You can edit and resubmit your podcast for review.')
            ->action('Edit Podcast', url('/my-podcasts'))
            ->line('Thank you for your patience.');
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

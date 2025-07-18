<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\Comment;

class CommentApproved extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Comment $comment
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $contentType = $this->comment->commentable_type_name;
        $contentTitle = $this->comment->commentable->title ?? 'Live Stream';

        return (new MailMessage)
            ->subject('Your Comment Has Been Approved')
            ->greeting('Great!')
            ->line('Your comment on "' . $contentTitle . '" has been approved and is now visible.')
            ->line('Thank you for engaging with our content!')
            ->action('View Comment', $this->getContentUrl())
            ->line('Keep the conversation going!');
    }

    private function getContentUrl(): string
    {
        $commentable = $this->comment->commentable;
        
        return match($this->comment->commentable_type) {
            \App\Models\Message::class => url('/messages/' . $commentable->id),
            \App\Models\Podcast::class => url('/podcasts/' . $commentable->id),
            \App\Models\StreamLink::class => url('/'),
            default => url('/')
        };
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

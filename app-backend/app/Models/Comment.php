<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Comment extends Model
{
    
    use HasFactory;

    protected $fillable = [
        'user_id',
        'commentable_type',
        'commentable_id',
        'body',
        'approved',
        'approved_at',
    ];

    protected $casts = [
        'approved' => 'boolean',
        'approved_at' => 'datetime',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function commentable()
    {
        return $this->morphTo();
    }

    // Scopes
    public function scopeApproved($query)
    {
        return $query->where('approved', true);
    }

    public function scopePending($query)
    {
        return $query->where('approved', false);
    }

    public function scopeRecent($query)
    {
        return $query->orderBy('created_at', 'desc');
    }

    public function scopeForStreamComments($query)
    {
        return $query->where('commentable_type', StreamLink::class);
    }

    public function scopeForMessages($query)
    {
        return $query->where('commentable_type', Message::class);
    }

    public function scopeForPodcasts($query)
    {
        return $query->where('commentable_type', Podcast::class);
    }

    // Helper methods
    public function approve(): void
    {
        $this->update([
            'approved' => true,
            'approved_at' => now(),
        ]);
    }

    public function reject(): void
    {
        $this->update([
            'approved' => false,
            'approved_at' => null,
        ]);
    }

    public function isPending(): bool
    {
        return !$this->approved;
    }

    public function isApproved(): bool
    {
        return $this->approved;
    }

    public function getTimeAgoAttribute(): string
    {
        return $this->created_at->diffForHumans();
    }

    public function getCommentableTypeNameAttribute(): string
    {
        return match($this->commentable_type) {
            StreamLink::class => 'Live Stream',
            Message::class => 'Message',
            Podcast::class => 'Podcast',
            default => 'Unknown'
        };
    }
}

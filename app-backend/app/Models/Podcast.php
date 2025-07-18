<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class Podcast extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia;

    protected $fillable = [
        'user_id',
        'title',
        'description',
        'audio_url',
        'allow_download',
        'listens',
        'status',
        'admin_note',
        'is_published',
        'published_at',
        'is_delete_requested',
        'delete_requested_at',
    ];

    protected $casts = [
        'allow_download' => 'boolean',
        'is_published' => 'boolean',
        'published_at' => 'datetime',
        'is_delete_requested' => 'boolean',
        'delete_requested_at' => 'datetime',
    ];

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('audio_file')
            ->singleFile()
            ->acceptsMimeTypes(['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg']);

        $this->addMediaCollection('cover_image')
            ->singleFile()
            ->acceptsMimeTypes(['image/jpeg', 'image/png', 'image/gif', 'image/webp']);
    }

    public function registerMediaConversions(?Media $media = null): void
    {
        $this->addMediaConversion('thumb')
            ->width(400)
            ->height(300)
            ->sharpen(10)
            ->optimize()
            ->performOnCollections('cover_image');

        $this->addMediaConversion('small')
            ->width(200)
            ->height(150)
            ->sharpen(10)
            ->optimize()
            ->performOnCollections('cover_image');
    }

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function comments()
    {
        return $this->morphMany(Comment::class, 'commentable');
    }

    public function favourites()
    {
        return $this->morphMany(Favourite::class, 'favouritable');
    }

    public function metrics()
    {
        return $this->morphMany(Metric::class, 'entity', 'entity_type', 'entity_id');
    }

    public function deletionRequest()
    {
        return $this->hasOne(PodcastDeletionRequest::class);
    }

    // Scopes
    public function scopePublished($query)
    {
        return $query->where('is_published', true)
            ->where('status', 'approved')
            ->where('is_delete_requested', false)
            ->where(function ($q) {
                $q->whereNull('published_at')
                  ->orWhere('published_at', '<=', now());
            });
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    public function scopeRejected($query)
    {
        return $query->where('status', 'rejected');
    }

    public function scopeByUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeSearch($query, $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('title', 'like', "%{$search}%")
              ->orWhere('description', 'like', "%{$search}%");
        });
    }

    public function scopePopular($query)
    {
        return $query->orderBy('listens', 'desc');
    }

    public function scopeRecent($query)
    {
        return $query->orderBy('published_at', 'desc');
    }

    // Accessors
    public function getCoverImageUrlAttribute(): ?string
    {
        return $this->getFirstMediaUrl('cover_image');
    }

    public function getCoverImageThumbUrlAttribute(): ?string
    {
        return $this->getFirstMediaUrl('cover_image', 'thumb');
    }

    public function getCoverImageSmallUrlAttribute(): ?string
    {
        return $this->getFirstMediaUrl('cover_image', 'small');
    }

    public function getAudioFileUrlAttribute(): ?string
    {
        return $this->getFirstMediaUrl('audio_file') ?: $this->audio_url;
    }

    public function getApprovedCommentsCountAttribute(): int
    {
        return $this->comments()->approved()->count();
    }

    public function getFavouritesCountAttribute(): int
    {
        return $this->favourites()->count();
    }

    public function getStatusBadgeColorAttribute(): string
    {
        return match($this->status) {
            'pending' => 'warning',
            'approved' => 'success',
            'rejected' => 'danger',
            default => 'secondary'
        };
    }

    // Helper methods
    public function approve(?string $adminNote = null): void
    {
        $this->update([
            'status' => 'approved',
            'admin_note' => $adminNote,
            'is_published' => true,
            'published_at' => now(),
        ]);
    }

    public function reject(?string $adminNote = null): void
    {
        $this->update([
            'status' => 'rejected',
            'admin_note' => $adminNote,
            'is_published' => false,
        ]);
    }

    public function incrementListens(): void
    {
        $this->increment('listens');
    }

    public function publish(): void
    {
        $this->update([
            'is_published' => true,
            'published_at' => now(),
        ]);
    }

    public function unpublish(): void
    {
        $this->update(['is_published' => false]);
    }

    public function requestDeletion(?string $reason = null): void
    {
        $this->update([
            'is_delete_requested' => true,
            'delete_requested_at' => now(),
        ]);

        // Create deletion request record
        $this->deletionRequest()->create([
            'user_id' => $this->user_id,
            'reason' => $reason,
            'status' => 'pending',
        ]);
    }

    public function approveDeletion(): void
    {
        $this->deletionRequest()?->update([
            'status' => 'approved',
            'reviewed_at' => now(),
        ]);
        
        $this->delete();
    }

    public function rejectDeletion(?string $adminNote = null): void
    {
        $this->update([
            'is_delete_requested' => false,
            'delete_requested_at' => null,
        ]);

        $this->deletionRequest()?->update([
            'status' => 'rejected',
            'admin_note' => $adminNote,
            'reviewed_at' => now(),
        ]);
    }

    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    public function isApproved(): bool
    {
        return $this->status === 'approved';
    }

    public function isRejected(): bool
    {
        return $this->status === 'rejected';
    }

    public function canEdit(): bool
    {
        return $this->status === 'pending' || $this->status === 'rejected';
    }

    public function canDelete(): bool
    {
        return !$this->is_delete_requested;
    }

    public function isDeleteRequested(): bool
    {
        return $this->is_delete_requested;
    }

    public function isFavouritedBy(?User $user): bool
    {
        if (!$user) {
            return false;
        }

        return $this->favourites()->where('user_id', $user->id)->exists();
    }
}
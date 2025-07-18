<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class Message extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia;

    protected $fillable = [
        'title',
        'description',
        'audio_url',
        'allow_download',
        'category_id',
        'listens',
        'is_published',
        'published_at',
    ];

    protected $casts = [
        'allow_download' => 'boolean',
        'is_published' => 'boolean',
        'published_at' => 'datetime',
    ];

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('cover_image')
            ->singleFile()
            ->acceptsMimeTypes(['image/jpeg', 'image/png', 'image/gif', 'image/webp']);

        $this->addMediaCollection('audio_file')
            ->singleFile()
            ->acceptsMimeTypes(['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg']);
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
    public function category()
    {
        return $this->belongsTo(Category::class);
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

    // Scopes
    public function scopePublished($query)
    {
        return $query->where('is_published', true)
            ->where(function ($q) {
                $q->whereNull('published_at')
                  ->orWhere('published_at', '<=', now());
            });
    }

    public function scopeByCategory($query, $categoryId)
    {
        return $query->where('category_id', $categoryId);
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

    // Helper methods
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

    public function isFavouritedBy(?User $user): bool
    {
        if (!$user) {
            return false;
        }

        return $this->favourites()->where('user_id', $user->id)->exists();
    }
}

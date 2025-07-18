<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class Category extends Model implements HasMedia 
{
    use HasFactory, InteractsWithMedia;

    protected $fillable = [
        'name',
        'slug',
        'description',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($category) {
            if (empty($category->slug)) {
                $category->slug = Str::slug($category->name);
            }
        });

        static::updating(function ($category) {
            if ($category->isDirty('name') && empty($category->slug)) {
                $category->slug = Str::slug($category->name);
            }
        });
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('image')
            ->singleFile()
            ->acceptsMimeTypes(['image/jpeg', 'image/png', 'image/gif', 'image/webp']);
    }

    public function registerMediaConversions(?Media $media = null): void
    {
        $this->addMediaConversion('thumb')
            ->width(300)
            ->height(200)
            ->sharpen(10)
            ->optimize();

        $this->addMediaConversion('small')
            ->width(150)
            ->height(100)
            ->sharpen(10)
            ->optimize();
    }

    // Relationships
    public function messages()
    {
        return $this->hasMany(Message::class);
    }

    // Accessors
    public function getImageUrlAttribute(): ?string
    {
        return $this->getFirstMediaUrl('image');
    }

    public function getImageThumbUrlAttribute(): ?string
    {
        return $this->getFirstMediaUrl('image', 'thumb');
    }

    public function getImageSmallUrlAttribute(): ?string
    {
        return $this->getFirstMediaUrl('image', 'small');
    }

    // Helper methods
    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function getMessagesCountAttribute(): int
    {
        return $this->messages()->published()->count();
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class StreamLink extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'url',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    // Relationships
    public function comments()
    {
        return $this->morphMany(Comment::class, 'commentable');
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    // Helper methods
    public static function getActiveStream(): ?self
    {
        return self::where('is_active', true)->first();
    }

    public function activate(): void
    {
        // Deactivate all other streams
        self::where('id', '!=', $this->id)->update(['is_active' => false]);
        
        // Activate this stream
        $this->update(['is_active' => true]);
    }

    public function deactivate(): void
    {
        $this->update(['is_active' => false]);
    }
}

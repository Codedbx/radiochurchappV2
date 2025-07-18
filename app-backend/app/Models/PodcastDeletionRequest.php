<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PodcastDeletionRequest extends Model
{
     use HasFactory;

    protected $fillable = [
        'podcast_id',
        'user_id',
        'reason',
        'status',
        'admin_note',
        'reviewed_at',
    ];

    protected $casts = [
        'reviewed_at' => 'datetime',
    ];

    // Relationships
    public function podcast()
    {
        return $this->belongsTo(Podcast::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Scopes
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

    // Helper methods
    public function approve(?string $adminNote = null): void
    {
        $this->update([
            'status' => 'approved',
            'admin_note' => $adminNote,
            'reviewed_at' => now(),
        ]);

        // Actually delete the podcast
        $this->podcast->delete();
    }

    public function reject(?string $adminNote = null): void
    {
        $this->update([
            'status' => 'rejected',
            'admin_note' => $adminNote,
            'reviewed_at' => now(),
        ]);

        // Restore the podcast visibility
        $this->podcast->update([
            'is_delete_requested' => false,
            'delete_requested_at' => null,
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

    public function getStatusBadgeColorAttribute(): string
    {
        return match($this->status) {
            'pending' => 'warning',
            'approved' => 'success',
            'rejected' => 'danger',
            default => 'secondary'
        };
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PodcastRequest extends Model
{
     use HasFactory;

    protected $fillable = [
        'user_id',
        'reason',
        'status',
        'note_to_admin',
        'admin_note',
        'reviewed_at',
    ];

    protected $casts = [
        'reviewed_at' => 'datetime',
    ];

    // Relationships
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

    public function scopeReviewed($query)
    {
        return $query->whereIn('status', ['approved', 'rejected']);
    }

    // Helper methods
    public function approve(?string $adminNote = null): void
    {
        $this->update([
            'status' => 'approved',
            'admin_note' => $adminNote,
            'reviewed_at' => now(),
        ]);
    }

    public function reject(?string $adminNote = null): void
    {
        $this->update([
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

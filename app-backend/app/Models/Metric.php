<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Metric extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'type',
        'entity_type',
        'entity_id',
        'ip_address',
        'user_agent',
        'country',
        'city',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function entity()
    {
        return $this->morphTo('entity', 'entity_type', 'entity_id');
    }

    public function scopeVisits($query)
    {
        return $query->where('type', 'visit');
    }

    public function scopeMessageListens($query)
    {
        return $query->where('type', 'message_listen');
    }

    public function scopePodcastListens($query)
    {
        return $query->where('type', 'podcast_listen');
    }

    public function scopeComments($query)
    {
        return $query->where('type', 'comment');
    }

    public function scopeFavourites($query)
    {
        return $query->where('type', 'favourite');
    }

    public function scopeToday($query)
    {
        return $query->whereDate('created_at', today());
    }

    public function scopeThisWeek($query)
    {
        return $query->whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()]);
    }

    public function scopeThisMonth($query)
    {
        return $query->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year);
    }

    public function scopeByCountry($query, $country)
    {
        return $query->where('country', $country);
    }

    public static function track(string $type, ?User $user = null, ?Model $entity = null, array $metadata = []): self
    {
        $request = request();
        
        return self::create([
            'user_id' => $user?->id,
            'type' => $type,
            'entity_type' => $entity ? get_class($entity) : null,
            'entity_id' => $entity?->id,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'metadata' => $metadata,
        ]);
    }

    public static function getAnalytics(string $period = 'month'): array
    {
        $query = self::query();

        match($period) {
            'today' => $query->today(),
            'week' => $query->thisWeek(),
            'month' => $query->thisMonth(),
            default => $query->thisMonth()
        };

        return [
            'total_visits' => $query->clone()->visits()->count(),
            'message_listens' => $query->clone()->messageListens()->count(),
            'podcast_listens' => $query->clone()->podcastListens()->count(),
            'comments' => $query->clone()->comments()->count(),
            'favourites' => $query->clone()->favourites()->count(),
            'top_countries' => $query->clone()->visits()
                ->selectRaw('country, count(*) as count')
                ->whereNotNull('country')
                ->groupBy('country')
                ->orderBy('count', 'desc')
                ->limit(10)
                ->get(),
        ];
    }
}

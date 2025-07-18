<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Favourite extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'favouritable_type',
        'favouritable_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function favouritable()
    {
        return $this->morphTo();
    }

    public function scopeMessages($query)
    {
        return $query->where('favouritable_type', Message::class);
    }

    public function scopePodcasts($query)
    {
        return $query->where('favouritable_type', Podcast::class);
    }
}

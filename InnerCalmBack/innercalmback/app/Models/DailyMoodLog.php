<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DailyMoodLog extends Model
{
    use HasFactory;

    // Add mood label mapping
    const MOOD_LABELS = [
        1 => 'Very Low',
        2 => 'Low',
        3 => 'Neutral',
        4 => 'High',
        5 => 'Very High'
    ];

    protected $fillable = [
        'user_id',
        'sleep_hours',
        'trained',
        'mood',
        'stress_level',
        'water_liters',
        'caffeine_cups',
        'social_interaction',
        'screen_hours',
        'ate_healthy',
        'spent_time_outside',
        'meditated',
        'work_study_hours',
        'enough_sleep_week',
        'physical_tiredness',
        'mental_tiredness',
        'motivation_level',
        'suicidal_thoughts',
        'critical'
    ];

    protected $casts = [
        'trained' => 'boolean',
        'social_interaction' => 'boolean',
        'ate_healthy' => 'boolean',
        'spent_time_outside' => 'boolean',
        'meditated' => 'boolean',
        'enough_sleep_week' => 'boolean',
        'suicidal_thoughts' => 'boolean',
        'critical' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Add accessor for mood label
    public function getMoodLabelAttribute(): string
    {
        return self::MOOD_LABELS[$this->mood] ?? 'Unknown';
    }

    // Add accessor for entry date (if needed)
    public function getEntryDateAttribute()
    {
        return $this->created_at->format('Y-m-d');
    }
}
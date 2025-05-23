<?php

// app/Models/User.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens; // Import Sanctum trait
use Illuminate\Database\Eloquent\Relations\HasMany; // Import HasMany

class User extends Authenticatable
{
    // Use Sanctum for API tokens and HasFactory for factories
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'age',
        'gender',   
        'is_admin',      // ← add th    // Added
        'avatar',        // Added for profile picture
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed', // Automatically hash passwords
          
        ];
    }

    /**
     * Get the mood entries for the user.
     */
    public function moodEntries(): HasMany // Define the relationship
    {
        return $this->hasMany(MoodEntry::class);
    }
}
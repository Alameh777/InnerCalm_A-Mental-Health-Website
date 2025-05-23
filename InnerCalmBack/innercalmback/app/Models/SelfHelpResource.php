<?php

// app/Models/SelfHelpResource.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SelfHelpResource extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'title',
        'video_url',
        'category',
        'description',
        'duration_minutes',
        'image_url',
    ];

     /**
     * The table associated with the model.
      * Optional if table name follows convention (plural snake_case)
     * @var string
     */
    // protected $table = 'self_help_resources';
}

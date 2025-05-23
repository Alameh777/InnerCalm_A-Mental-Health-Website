<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('mood_entries', function (Blueprint $table) {
            $table->id();
            // Foreign key constraint linking to the users table
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->date('entry_date');
            $table->tinyInteger('mood_score')->nullable(); // e.g., 1-5
            $table->decimal('sleep_hours', 4, 2)->nullable(); // e.g., 7.5
            $table->tinyInteger('stress_level')->nullable(); // e.g., 1-5
            $table->string('activity_level')->nullable(); // e.g., 'Light', 'Moderate'
            $table->text('notes')->nullable();
            // Add other survey question columns here
            $table->timestamps();

            // Ensure a user can only submit one entry per day
            $table->unique(['user_id', 'entry_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mood_entries');
    }
};
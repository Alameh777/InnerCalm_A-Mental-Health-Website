<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('daily_mood_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained();
            $table->float('sleep_hours');
            $table->boolean('trained');
            $table->unsignedTinyInteger('mood'); // 1-5 scale
            $table->unsignedTinyInteger('stress_level'); // 1-5 scale
            $table->float('water_liters');
            $table->unsignedSmallInteger('caffeine_cups');
            $table->boolean('social_interaction');
            $table->float('screen_hours');
            $table->boolean('ate_healthy');
            $table->boolean('spent_time_outside');
            $table->boolean('meditated');
            $table->float('work_study_hours');
            $table->boolean('enough_sleep_week');
            $table->unsignedTinyInteger('physical_tiredness'); // 1-5 scale
            $table->unsignedTinyInteger('mental_tiredness'); // 1-5 scale
            $table->unsignedTinyInteger('motivation_level'); // 1-5 scale
            $table->boolean('suicidal_thoughts');
            $table->boolean('critical')->default(false);
            $table->timestamps();
            
            // Index for frequent queries
            $table->index(['user_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('daily_mood_logs');
    }
};

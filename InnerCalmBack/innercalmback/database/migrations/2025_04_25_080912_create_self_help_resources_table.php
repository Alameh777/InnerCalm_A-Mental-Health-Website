<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;


return new class extends Migration
{
    public function up(): void
    {
        Schema::create('self_help_resources', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('video_url'); // YouTube ID or embed URL
            $table->string('category');
            $table->text('description')->nullable();
            $table->integer('duration_minutes')->unsigned()->nullable();
            $table->timestamps();
            
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('self_help_resources');
    }
};
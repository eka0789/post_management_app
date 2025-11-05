<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('posts', function (Blueprint $table) {
            $table->id();

            $table->foreignId('author_id')
                  ->constrained('users')
                  ->onDelete('cascade');

            $table->string('title', 255);
            $table->string('slug', 255)->unique();
            $table->string('excerpt', 500)->nullable();
            $table->longText('body');

            $table->enum('status', ['draft', 'published', 'archived'])
                  ->default('draft')
                  ->index();

            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};

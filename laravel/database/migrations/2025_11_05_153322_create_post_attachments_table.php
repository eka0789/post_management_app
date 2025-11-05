<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('post_attachments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('post_id')
                  ->constrained('posts')
                  ->onDelete('cascade');

            $table->string('disk', 50)->default('public');
            $table->string('path', 500);
            $table->string('type', 50)->nullable();
            $table->string('mime_type', 100)->nullable();
            $table->unsignedBigInteger('size')->default(0);
            $table->integer('order')->default(0);
            $table->json('meta')->nullable();

            $table->softDeletes();
            $table->timestamps();

            $table->index(['post_id', 'type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('post_attachments');
    }
};

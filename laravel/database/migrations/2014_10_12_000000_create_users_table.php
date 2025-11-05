<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();

            // Data dasar
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');

            // Tambahan: Role pengguna
            $table->enum('role', ['admin', 'editor', 'user'])
                  ->default('user')
                  ->index()
                  ->comment('Peran pengguna sistem');

            // Opsional tambahan profil
            $table->string('avatar')->nullable();
            $table->text('bio')->nullable();

            $table->rememberToken();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};

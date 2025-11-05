<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Post;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@pma.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        $editor = User::create([
            'name' => 'Editor User',
            'email' => 'editor@pma.com',
            'password' => Hash::make('password'),
            'role' => 'editor',
        ]);

        $user = User::create([
            'name' => 'Regular User',
            'email' => 'user@pma.com',
            'password' => Hash::make('password'),
            'role' => 'user',
        ]);

        Post::factory()->count(5)->create([
            'author_id' => $admin->id,
            'status' => 'published'
        ]);
    }
}

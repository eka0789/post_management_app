<?php

namespace Database\Factories;

use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class PostFactory extends Factory
{
    protected $model = Post::class;

    public function definition(): array
    {
        $title = $this->faker->sentence(6);
        return [
            'author_id' => User::inRandomOrder()->first()?->id ?? User::factory(),
            'title' => $title,
            'slug' => Str::slug($title) . '-' . Str::random(5),
            'excerpt' => $this->faker->paragraph(),
            'body' => $this->faker->paragraphs(4, true),
            'status' => $this->faker->randomElement(['draft', 'published']),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}

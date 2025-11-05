<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PostAttachment extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'post_id', 'disk', 'path', 'type', 'mime_type', 'size', 'order', 'meta'
    ];

    protected $casts = [
        'meta' => 'array'
    ];

    public function post()
    {
        return $this->belongsTo(Post::class);
    }

    // Helper: URL penuh untuk file
    public function getUrlAttribute(): string
    {
        return asset('storage/' . $this->path);
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePostRequest;
use App\Http\Requests\UpdatePostRequest;
use App\Models\Post;
use Illuminate\Support\Str;
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function index(Request $request)
    {
        $query = Post::with('author')
            ->when($request->q, fn($q) => $q->where('title', 'like', "%{$request->q}%"))
            ->orderByDesc('created_at');

        $posts = $query->paginate($request->get('per_page', 10));

        return response()->json($posts);
    }

    public function show($id)
    {
        $post = Post::with('author')->findOrFail($id);
        return response()->json($post);
    }

    public function store(StorePostRequest $request)
    {
        $user = $request->user();

        if (! in_array($user->role, ['admin', 'editor'])) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $data = $request->validated();
        $data['slug'] = Str::slug($data['title']);
        $data['author_id'] = $user->id;

        $post = Post::create($data);

        return response()->json($post, 201);
    }

    public function update(UpdatePostRequest $request, $id)
    {
        $post = Post::findOrFail($id);
        $user = $request->user();

        if ($user->cannot('update', $post)) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $data = $request->validated();
        $data['slug'] = Str::slug($data['title'] ?? $post->title);
        $post->update($data);

        return response()->json($post);
    }

    public function destroy(Request $request, $id)
    {
        $post = Post::findOrFail($id);
        $user = $request->user();

        if ($user->cannot('delete', $post)) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $post->delete();
        return response()->json(['message' => 'Deleted']);
    }
}

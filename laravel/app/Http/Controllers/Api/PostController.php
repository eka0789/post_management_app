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
    // app/Http/Controllers/Api/PostController.php
public function index(Request $request)
{
    $query = Post::with('author');

    // 🔹 Search
    if ($search = $request->get('search')) {
        $query->where('title', 'like', "%{$search}%");
    }

    // 🔹 Filter by status
    if ($status = $request->get('status')) {
        $query->where('status', $status);
    }

    // 🔹 Filter by author
    if ($authorId = $request->get('author_id')) {
        $query->where('author_id', $authorId);
    }

    // 🔹 Sorting
    switch ($request->get('sort')) {
        case 'oldest':
            $query->orderBy('created_at', 'asc');
            break;
        case 'title_asc':
            $query->orderBy('title', 'asc');
            break;
        case 'title_desc':
            $query->orderBy('title', 'desc');
            break;
        default:
            $query->orderBy('created_at', 'desc');
    }

    return $query->paginate($request->get('per_page', 10));
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

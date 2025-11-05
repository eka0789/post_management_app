<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PostController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    /**
     * ==============================
     * 🔐 AUTHENTICATION ROUTES
     * ==============================
     */
    Route::post('auth/register', [AuthController::class, 'register']);
    Route::post('auth/login', [AuthController::class, 'login']);

    /**
     * ==============================
     * 🌍 PUBLIC ROUTES
     * ==============================
     * Akses terbuka untuk publik (tanpa token).
     * Aman untuk ditampilkan di homepage Next.js.
     */
    Route::get('posts', [PostController::class, 'index']);   // daftar semua post (public)
    Route::get('posts/{id}', [PostController::class, 'show']); // detail post (public)

    /**
     * ==============================
     * 🔒 PROTECTED ROUTES (Auth:Sanctum)
     * ==============================
     * Hanya untuk user yang sudah login via token.
     */
    Route::middleware('auth:sanctum')->group(function () {
        // Authenticated user actions
        Route::post('auth/logout', [AuthController::class, 'logout']);
        Route::get('auth/me', [AuthController::class, 'me']);

        // CRUD post actions
        Route::post('posts', [PostController::class, 'store']);
        Route::put('posts/{id}', [PostController::class, 'update']);
        Route::delete('posts/{id}', [PostController::class, 'destroy']);
    });
});

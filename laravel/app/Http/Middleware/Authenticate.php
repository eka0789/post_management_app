<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;

class Authenticate extends Middleware
{
    protected function redirectTo($request): ?string
    {
        if (! $request->expectsJson()) {
            abort(response()->json([
                'message' => 'Unauthenticated.'
            ], 401));
        }

        return null;
    }
}

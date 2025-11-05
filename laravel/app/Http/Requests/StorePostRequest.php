<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePostRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'title'   => 'required|string|max:255',
            'excerpt' => 'nullable|string|max:500',
            'body'    => 'required|string',
            'status'  => 'in:draft,published,archived',
        ];
    }
}

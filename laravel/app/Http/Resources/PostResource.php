<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PostResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'        => $this->id,
            'title'     => $this->title,
            'slug'      => $this->slug,
            'excerpt'   => $this->excerpt,
            'body'      => $this->body,
            'status'    => $this->status,
            'author'    => [
                'id'    => $this->author->id ?? null,
                'name'  => $this->author->name ?? null,
                'email' => $this->author->email ?? null,
            ],
            'tags'        => TagResource::collection($this->whenLoaded('tags')),
            'attachments' => AttachmentResource::collection($this->whenLoaded('attachments')),
            'created_at'  => $this->created_at?->toISOString(),
            'updated_at'  => $this->updated_at?->toISOString(),
        ];
    }
}

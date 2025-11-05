<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AttachmentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'   => $this->id,
            'type' => $this->type,
            'path' => $this->path,
            'url'  => $this->url,
            'size' => $this->size,
            'meta' => $this->meta,
        ];
    }
}

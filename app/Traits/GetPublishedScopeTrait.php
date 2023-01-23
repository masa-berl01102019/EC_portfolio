<?php

namespace App\Traits;

trait GetPublishedScopeTrait
{
    public function scopeGetPublished($query) {
        return $query->where('is_published', config('define.is_published_r.open'));
    }

}

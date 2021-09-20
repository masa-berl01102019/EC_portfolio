<?php

namespace App\Traits;

trait OrderByCreatedAtScopeTrait
{
    public function scopeOrderByCreatedAt($query, $request) {

        $sort = $request->input('created_at');

        $query->when($sort, function($query, $sort) {
            return $query->orderBy('created_at', $sort);
        });

    }
}

<?php

namespace App\Traits;

trait OrderByUpdatedAtScopeTrait
{
    public function scopeOrderByUpdatedAt($query, $request) {

        $sort = $request->input('updated_at');

        $query->when($sort, function($query, $sort) {
            return $query->orderBy('updated_at', $sort);
        });

    }
}

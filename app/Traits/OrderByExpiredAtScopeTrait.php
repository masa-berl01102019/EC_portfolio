<?php

namespace App\Traits;

trait OrderByExpiredAtScopeTrait
{
    public function scopeOrderByExpiredAt($query, $request) {

        $sort = $request->input('expired_at');

        $query->when($sort, function($query, $sort) {
            return $query->orderBy('expired_at', $sort);
        });

    }
}

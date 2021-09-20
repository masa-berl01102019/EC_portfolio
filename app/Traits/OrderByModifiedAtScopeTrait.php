<?php

namespace App\Traits;

trait OrderByModifiedAtScopeTrait
{
    public function scopeOrderByModifiedAt($query, $request) {

        $sort = $request->input('modified_at');

        $query->when($sort, function($query, $sort) {
            return $query->orderBy('modified_at', $sort);
        });

    }
}

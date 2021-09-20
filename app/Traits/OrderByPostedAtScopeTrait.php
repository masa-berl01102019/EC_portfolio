<?php

namespace App\Traits;

trait OrderByPostedAtScopeTrait
{
    public function scopeOrderByPostedAt($query, $request) {

        $sort = $request->input('posted_at');

        $query->when($sort, function($query, $sort) {
            return $query->orderBy('posted_at', $sort);
        });

    }
}

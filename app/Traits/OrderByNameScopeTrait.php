<?php

namespace App\Traits;

trait OrderByNameScopeTrait
{
    public function scopeOrderByName($query, $request) {

        $sort = $request->input('last_name_kana');

        $query->when($sort, function($query, $sort) {
            return $query->orderBy('last_name_kana', $sort)->orderBy('first_name_kana', $sort);
        });

    }
}

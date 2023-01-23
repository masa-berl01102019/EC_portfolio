<?php

namespace App\Traits;

trait OrderByBirthdayScopeTrait
{
    public function scopeOrderByBirthday($query, $request) {

        $sort = $request->input('birthday');

        $query->when($sort, function($query, $sort) {
            return $query->orderBy('birthday', $sort);
        });

    }
}

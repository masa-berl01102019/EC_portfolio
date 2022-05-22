<?php

namespace App\Traits;

trait OrderByItemNameScopeTrait
{
    public function scopeOrderByItemName($query, $request) {

        $sort = $request->input('item_name');
        
        $query->when($sort, function($query, $sort) {
            return $query->orderBy('item_name', $sort);
        });
    }
}

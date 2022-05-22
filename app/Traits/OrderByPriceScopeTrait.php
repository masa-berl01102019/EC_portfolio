<?php

namespace App\Traits;

trait OrderByPriceScopeTrait
{
    public function scopeOrderByPrice($query, $request) {

        $sort = $request->input('price');
        
        $query->when($sort, function($query, $sort) {
            return $query->orderBy('price', $sort);
        });
    }
}

<?php

namespace App\Traits;

trait FilterBrandScopeTrait
{
    public function scopeFilterBrand($query, $request, $table_name = 'brand', $column_name = 'id')
    {

        $filter = $request->input('f_brand');

        $flag = $filter !== null ? true : false;

        $query->when($flag, function ($query) use ($filter, $table_name, $column_name) {
            $query->whereHas($table_name, function ($query) use ($filter, $column_name) {
                $receiver_arr = explode(',', $filter);
                return $query->whereIn($column_name, $receiver_arr);
            });
        });
    }
}

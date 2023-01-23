<?php

namespace App\Traits;

trait FilterColorScopeTrait
{
    public function scopeFilterColor($query, $request, $table_name = 'skus.color', $column_name = 'id')
    {

        $filter = $request->input('f_color');

        $flag = $filter !== null ? true : false;

        $query->when($flag, function ($query) use ($filter, $table_name, $column_name) {
            $query->whereHas($table_name, function ($query) use ($filter, $column_name) {
                $receiver_arr = explode(',', $filter);
                return $query->whereIn($column_name, $receiver_arr);
            });
        });
    }
}

<?php

namespace App\Traits;

trait FilterGenderCategoryScopeTrait
{
    public function scopeFilterGenderCategory($query, $request)
    {
        $filter = $request->input('f_gender_category');
        $flag = $filter !== null ? true : false;
        $query->when($flag, function ($query) use ($filter) {
            $receiver_arr = explode(',', $filter);
            return $query->whereIn('category_id', $receiver_arr);
        });
    }
}

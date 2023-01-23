<?php

namespace App\Traits;

trait FilterTagScopeTrait
{
    public function scopeFilterTag($query, $request)
    {

        $filter = $request->input('f_tag');

        $flag = $filter !== null ? true : false;

        $query->when($flag, function ($query) use ($filter) {
            $query->whereHas('tags', function ($query) use ($filter) {
                $receiver_arr = explode(',', $filter);
                return $query->whereIn('tags.id', $receiver_arr);
            });
        });
    }
}

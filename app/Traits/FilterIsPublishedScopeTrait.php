<?php

namespace App\Traits;

trait FilterIsPublishedScopeTrait
{
    public function scopeFilterIsPublished($query, $request)
    {

        $filter = $request->input('f_is_published');

        $flag = $filter !== null ? true : false;

        $query->when($flag, function ($query) use ($filter) {
            $receiver_arr = explode(',', $filter);
            return $query->whereIn('is_published', $receiver_arr);
        });
    }
}

<?php

namespace App\Traits;

trait FilterTagScopeTrait
{
    public function scopeFilterTag($query, $request) {

        $filter = $request->input('f_tag');

        $flag = $filter !== null ? true : false;

        $query->when($flag, function($query) use($filter) {
            $query->whereHas('tags', function ($query) use($filter) {
                // カンマ区切りで配列に変換
                $receiver_arr = explode(',',$filter);
                // 配列内に該当する項目を絞り込み検索
                return $query->whereIn('tags.id', $receiver_arr);
            });
        });
    }

}

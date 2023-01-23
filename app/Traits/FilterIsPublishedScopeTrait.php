<?php

namespace App\Traits;

trait FilterIsPublishedScopeTrait
{
    public function scopeFilterIsPublished($query, $request) {

        $filter = $request->input('f_is_published');

        $flag = $filter !== null ? true : false;

        $query->when($flag, function($query) use($filter) {
            // カンマ区切りで配列に変換
            $receiver_arr = explode(',',$filter);
            // 配列内に該当する項目を絞り込み検索
            return $query->whereIn('is_published', $receiver_arr);
        });

    }

}

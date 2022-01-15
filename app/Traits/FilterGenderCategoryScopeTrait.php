<?php

namespace App\Traits;

trait FilterGenderCategoryScopeTrait
{
    public function scopeFilterGenderCategory($query, $request) {
        $filter = $request->input('f_gender_category');
        $flag = $filter !== null ? true : false;
        $query->when($flag, function($query) use($filter) {         
            // カンマ区切りで配列に変換
            $receiver_arr = explode(',',$filter);
            // 配列内に該当する項目を絞り込み検索
            return $query->whereIn('category_id', $receiver_arr);
        });
    }
}

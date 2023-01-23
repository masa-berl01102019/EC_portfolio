<?php

namespace App\Traits;

trait FilterGenderScopeTrait
{
    public function scopeFilterGender($query, $request) {

        $filter = $request->input('f_gender');

        $flag = $filter !== null ? true : false;

        $query->when($flag, function($query) use($filter) {
            // カンマ区切りで配列に変換
            $gender_arr = explode(',',$filter);
            // 配列内に該当する項目を絞り込み検索
            return $query->whereIn('gender', $gender_arr);
        });

    }

}

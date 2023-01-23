<?php

namespace App\Traits;

trait FilterSizeScopeTrait
{
    public function scopeFilterSize($query, $request, $table_name = 'skus.size', $column_name = 'id') {

        $filter = $request->input('f_size');

        $flag = $filter !== null ? true : false;
        
        $query->when($flag, function($query) use($filter, $table_name, $column_name) {
            $query->whereHas($table_name, function ($query) use($filter, $column_name) {
                // カンマ区切りで配列に変換
                $receiver_arr = explode(',',$filter);
                // 配列内に該当する項目を絞り込み検索
                return $query->whereIn($column_name, $receiver_arr);
            });
        });
    }
}

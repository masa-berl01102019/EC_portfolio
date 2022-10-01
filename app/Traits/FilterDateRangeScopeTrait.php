<?php

namespace App\Traits;

use Illuminate\Support\Carbon;

trait FilterDateRangeScopeTrait
{
    public function scopeFilterDateRange($query, $request, $prefix = null) {

        // 期間の取得
        $cloumn = $request->input('f_target_span');
        $from = $request->input('f_from');
        $to = $request->input('f_to');

        // 該当のkeyがあるかチェック
        $flag = !empty($cloumn) && (!empty($from) || !empty($to)) ? true : false;

        $query->when($flag, function($query) use($cloumn, $from, $to, $prefix) {
            // $prefixにはテーブル名が入ってくるのでnullでなければ文字列を連結
            $column_name = $prefix !== null ? $prefix.'.'.$cloumn : $cloumn;
            // 開始日と終了日を解析
            $begin = Carbon::parse($from);
            $end = Carbon::parse($to);
            // 開始日と終了日をwhereBetween()でクエリに追加
            return $query->whereBetween($column_name, [$begin,$end]);
        });

    }

}

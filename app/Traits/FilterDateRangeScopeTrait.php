<?php

namespace App\Traits;

use Illuminate\Support\Carbon;

trait FilterDateRangeScopeTrait
{
    public function scopeFilterDateRange($query, $request, $prefix = null) {

        // パラメータを取得してarray_flip()でkeyとvalueを反転させてpreg_grep()で正規表現を使って該当の連想配列を取り出す * keyとvalueが反転した状態で連想配列が返されてる
        $flip_array = preg_grep( '/f_dr_/', array_flip($request->query()) ); // f_dr_ = 期間指定のフィルタリング 
        // 該当のkeyがあるかチェック
        $flag = !empty($flip_array) ? true : false;

        $query->when($flag, function($query) use($flip_array, $prefix) {
            // array_key_first()で最初のキーを取得して変数に格納
            $index = array_key_first($flip_array);
            // keyとvalueが反転してるのでvalueに対してstr_replace()でプレフィックスを取り除いてカラム名を取得
            $column_name = str_replace('f_dr_', '', $flip_array[$index]);
            // $prefixにはテーブル名が入ってくるのでnullでなければ文字列を連結
            $column_name = $prefix !== null ? $prefix.'.'.$column_name : $column_name;
            // keyとvalueが反転してるのでkeyには日付が「検索開始日,検索終了日」の形で入ってるのでexplode()で配列に変換
            $date_array = explode(',',$index);
            // 開始日と終了日を解析
            $begin = Carbon::parse($date_array[0]);
            $end = Carbon::parse( $date_array[1]);
            // 開始日と終了日をwhereBetween()でクエリに追加
            return $query->whereBetween($column_name, [$begin,$end]);
        });

    }

}

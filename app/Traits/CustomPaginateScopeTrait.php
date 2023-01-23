<?php

namespace App\Traits;

trait CustomPaginateScopeTrait
{
    public function scopeCustomPaginate($query, $request)
    {

        // 1ページ当たり件数の指定の有無を確認
        if ($request->input('per_page')) {
            $per_page = $request->input('per_page');
            // 取得件数が指定されていた場合はpaginationに引数としてわたしてあげる * 数字にキャストしないと返り値が文字列になってしまうので注意
            return $query->paginate((int)$per_page);
        } else {
            // 取得件数が未設定の場合はデフォルトの表示件数 １２件
            return $query->paginate(12);
        }
    }
}

<?php

namespace App\Traits;

trait FilterKeywordScopeTrait
{

    public function scopeFilterKeyword($query, $request, $columns)
    {

        $filter = $request->input('f_search');

        $flag = $filter !== null ? true : false;

        $query->when($flag, function ($query) use ($filter, $columns) {

            // 全角スペースを半角スペースに変換
            $keyword = mb_convert_kana($filter, 's', 'UTF-8');
            // 前後のスペース削除（trimの対象半角スペースのみなので半角スペースに変換後行う）
            $keyword = trim($keyword);
            // 連続する半角スペースを半角スペースカンマに変換
            $keyword = preg_replace('/\s+/', ',', $keyword);
            // カンマ区切りで配列に変換
            $keywords = explode(',', $keyword);
            // キーワード検索で渡ってきた値と部分一致するアイテムに絞りこみ * DBのカラムが分かれてるのでスペースなしでフルネームで検索されると表示されない！！
            return $query->where(function ($query) use ($keywords, $columns) {
                foreach ($keywords as $keyword) {
                    // 複数のkeywordを検索
                    for ($i = 0; $i < count($columns); $i++) {
                        $query->orWhere($columns[$i], 'like', "%{$keyword}%");
                    }
                }
            });
        });
    }
}

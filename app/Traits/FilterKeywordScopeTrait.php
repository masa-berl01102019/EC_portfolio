<?php

namespace App\Traits;

trait FilterKeywordScopeTrait
{

    public function scopeFilterKeyword($query, $request, $columns)
    {

        $filter = $request->input('f_search');

        $flag = $filter !== null ? true : false;

        $query->when($flag, function ($query) use ($filter, $columns) {

            // Convert full-width to half-width by using mb_convert_kana function
            $keyword = mb_convert_kana($filter, 's', 'UTF-8');
            // Delete white space in back and fort （trim() can use against half-width white space）
            $keyword = trim($keyword);
            // Convert white space between characters into comma
            $keyword = preg_replace('/\s+/', ',', $keyword);
            // Convert it into array
            $keywords = explode(',', $keyword);
            // Get data which is partially matched by the value of keywords
            return $query->where(function ($query) use ($keywords, $columns) {
                foreach ($keywords as $keyword) {
                    for ($i = 0; $i < count($columns); $i++) {
                        $query->orWhere($columns[$i], 'like', "%{$keyword}%");
                    }
                }
            });
        });
    }
}

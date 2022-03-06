<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;

class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return string
     */

    protected function redirectTo($request)
    {
        if (!$request->expectsJson()) { // $request->expectsJson()はリクエストされているのがHTMLなのか、JSONなのかを判断してtrue or falseで返す
            return route('login');
        }

        // 上記のredirectToメソッドは認証が完了していないユーザーをリダイレクトする ＊ 今回はlaravelをAPIとして利用してるので利用しない
    }
}

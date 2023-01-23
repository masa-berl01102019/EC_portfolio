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
    // user/admin それぞれのログイン認証が完了しなかった場合のリダイレクト先のルーティング名を変数で格納
    protected $user_route = 'user.login';
    protected $admin_route = 'admin.login';

    protected function redirectTo($request)
    {
        // ルーティングに応じて未ログイン時のリダイレクト先を振り分ける
        if (!$request->expectsJson()) {
            if ($request->is('user/*')) {
                // is(); は指定した文字列がパターンに一致しているかを判定　＊アスタリスクはワイルドカードとして利用されてる
                return route($this->user_route);
                // return route('url'); でユーザーのログインページにリダイレクト
            }
            if ($request->is('admin/*')) {
                return route($this->admin_route);
            }
        }
        //　上記のredirectToメソッドは認証が完了していないユーザーをリダイレクトするmethod
        // php artisan route:listで実行した時に表示されるName列の名前を上記のroute(‘Name列の値’)と指定することでリダイレクト先を指定できる
    }
}

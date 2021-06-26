<?php

namespace App\Http\Middleware;

use App\Providers\RouteServiceProvider;
use Closure;
use Illuminate\Support\Facades\Auth;

class RedirectIfAuthenticated
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string|null  $guard
     * @return mixed
     */
    // ログイン済みの状態で/loginにアクセスしてきた時のリダイレクト先を指定を行う
    public function handle($request, Closure $next, $guard = null)
    {
        if (Auth::guard($guard)->check()) {
            // 上記はAuth::Guard(インスタンス名)で認証に使うGuardを指定してAuth::check()でログインしてるかcheck
            if ($guard === 'user') {
                // $guardがuserの場合の条件分岐
                return redirect(RouteServiceProvider::HOME);
            }
            if ($guard === 'admin') {
                // $guardがadminの場合の条件分岐
                return redirect(RouteServiceProvider::ADMIN_HOME);
            }
            // 上記でadmin/userのリダイレクト先を指定している
        }

        return $next($request);
    }
}

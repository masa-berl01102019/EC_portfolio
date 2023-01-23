<?php
namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Auth\AuthenticationException;

class AuthController extends Controller
{
    public function auth()
    {
        // ログインしているかチェック
        if (Auth::guard('admin')->check()) {
            // ログインしていればユーザー名を返却
            return response()->json(Auth::guard('admin')->user()->full_name);
        }

        return false;
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::guard('admin')->attempt($credentials)) {
            // セッションIDの再発行
            $request->session()->regenerate();
            // 認証成功時にTRUEを返却
            return response()->json(['success' => true, 'message' => 'ログインに成功しました'], 200);
        }
        // 認証失敗時にFALSEを返却
        return throw new AuthenticationException('ログインに失敗しました');
    }

    public function logout(Request $request)
    {
        // ユーザーがログインしてるかチェック
        if(Auth::guard('admin')->check()) {
            // ユーザーのログアウト
            Auth::guard('admin')->logout();
            // セッションIDの再発行
            $request->session()->regenerate();
            // ログアウト成功時にTRUEを返却
            return response()->json(['success' => true, 'message' => 'ログアウトに成功しました'], 200);
        }
        // 認証失敗時にFALSEを返却
        return throw new AuthenticationException('ログアウトに失敗しました');
    }


}

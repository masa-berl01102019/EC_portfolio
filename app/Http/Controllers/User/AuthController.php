<?php
namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function auth()
    {
        // ログインしているかチェック
        if (Auth::guard('user')->check()) {
            // ログインしていればユーザー名を返却
            return response()->json(Auth::guard('user')->user()->full_name);
        }

        return false;
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::guard('user')->attempt($credentials)) {
            // セッションIDの再発行
            $request->session()->regenerate();
            // 認証成功時にTRUEを返却
            return response()->json(['success' => true, 'message' => 'ログインに成功しました'], 200);
        }
        // 認証失敗時にFALSEを返却
        return response()->json(['success' => false, 'message' => 'ログインに失敗しました'], 401);
    }

    public function logout(Request $request)
    {
        // ユーザーがログインしてるかチェック
        if(Auth::guard('user')->check()) {
            // ユーザーのログアウト
            Auth::guard('user')->logout();
            // セッションIDの再発行
            $request->session()->regenerate();
            // ログアウト成功時にTRUEを返却
            return response()->json(['success' => true, 'message' => 'ログアウトに成功しました'], 200);
        }
        // 認証失敗時にFALSEを返却
        return response()->json(['success' => false, 'message' => 'ログアウトに失敗しました'], 401);
    }


}

<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function auth()
    {
        if (Auth::guard('user')->check()) {
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
            $request->session()->regenerate();
            return response()->json(['status' => 1, 'message' => 'ログインに成功しました'], 200);
        }

        return response()->json(['status' => 9, 'message' => 'ログインに失敗しました'], 401);
    }

    public function logout(Request $request)
    {
        if (Auth::guard('user')->check()) {
            Auth::guard('user')->logout();
            $request->session()->regenerate();
            return response()->json(['status' => 1, 'message' => 'ログアウトに成功しました'], 200);
        }

        return response()->json(['status' => 9, 'message' => 'ログアウトに失敗しました'], 401);
    }
}

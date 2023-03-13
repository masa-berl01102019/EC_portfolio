<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function auth()
    {
        if (Auth::guard('admin')->check()) {
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
            $request->session()->regenerate();
            return response()->json(['status' => config('define.api_status.success'), 'message' => trans('api.admin.auth.login_msg')], 200);
        }

        return response()->json(['status' => config('define.api_status.error'), 'message' => trans('api.admin.auth.login_err')], 401);
    }

    public function logout(Request $request)
    {
        if (Auth::guard('admin')->check()) {
            Auth::guard('admin')->logout();
            $request->session()->regenerate();
            return response()->json(['status' => config('define.api_status.success'), 'message' => trans('api.admin.auth.logout_msg')], 200);
        }

        return response()->json(['status' => config('define.api_status.error'), 'message' => trans('api.admin.auth.logout_err')], 401);
    }
}

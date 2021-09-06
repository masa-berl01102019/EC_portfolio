<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\User;

class UserController extends Controller
{
    // マルチ認証テスト用　コントローラー

    public function __construct()
    {
        // Auth認証
        $this->middleware('auth:user');
    }

    public function index()
    {
        $users = User::query()->take(10)->get();
        // レスポンスを返却
        return response()->json(['users' => $users]);
    }
}

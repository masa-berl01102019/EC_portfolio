<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;

class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth:admin');
    }
    // 上記のようにHomeController.phpのconstructメソッドでmiddleware(ミドルウェア)でauthを設定することで、
    //　HomeControllerを経由して行われる処理はすべて認証によるアクセスの制限が行われる。

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function index()
    {
        return view('admin.home');
    }
}

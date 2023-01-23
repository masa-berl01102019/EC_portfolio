<?php

namespace App\Http\Controllers\Admin\Auth;

use App\Http\Controllers\Controller;
use App\Providers\RouteServiceProvider;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles authenticating users for the application and
    | redirecting them to your home screen. The controller uses a trait
    | to conveniently provide its functionality to your applications.
    |
    */

    use AuthenticatesUsers;

    /**
     * Where to redirect users after login.
     *
     * @var string
     */
    protected $redirectTo = RouteServiceProvider::ADMIN_HOME;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        // RedirectIfAuthenticatedクラス(ログイン済みの状態でログインしてきた場合にリダイレクト先を振り分ける処理が書かれてるクラス)はguestという名前でApp\Http\Kernelクラスに登録されている
        // インスタンス生成時にmiddleware('guest:パラメータ')の形でadminガードを渡して検証している
        $this->middleware('guest:admin')->except('logout');
    }

    //　アプリケーションから Guard を呼び出すには、基本的に Auth ファサードを使います。
    //　Auth ファサードは、 Guardインスタンスに静的なインターフェイス を提供しています。
    //　Auth::login() は Guardインスタンスの login() 、 Auth::user() はGuardインスタンスの user() を呼び出しています。
    //　ただし Auth::login() 等で呼び出すのは auth.php でdefault に指定したguardです。
    //　それ以外の guard を呼び出すには Auth::guard('api')->login() のように guard 名を指定する必要があります。

    // Guardの認証方法を指定
    protected function guard()
    {
        return Auth::guard('admin');
    }

    // ログイン画面の表示
    public function showLoginForm()
    {
        return view('admin.auth.login');
    }

    // ログアウト処理
    public function logout()
    {
        Auth::guard('admin')->logout();

        return redirect(route('admin.login'));
    }


}

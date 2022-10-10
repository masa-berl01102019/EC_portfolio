<?php

namespace App\Http\Controllers\User;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Http\Requests\user\UserEditRequest;
use App\Http\Requests\user\UserRegisterRequest;

// TODO: ユーザーの新規登録時にはメールアドレス認証を必須にする
class UserController extends Controller
{
    // 該当のカラム以外を扱わないようにホワイトリスト作成
    private $form_items = [
        'last_name', 'last_name', 'first_name', 'last_name_kana', 'first_name_kana', 'gender', 'birthday', 'post_code', 'prefecture', 'municipality', 'street_name', 'street_number', 'building',
        'delivery_post_code', 'delivery_prefecture', 'delivery_municipality', 'delivery_street_name', 'delivery_street_number', 'delivery_building', 'tel', 'email', 'password', 'is_received'
    ];

    public function __construct()
    {
        // Auth認証
        // $this->middleware('auth:user');
    }

    public function index()
    {
        $users = User::query()->take(10)->get();
        // レスポンスを返却
        return response()->json(['users' => $users]);
    }

    public function store(UserRegisterRequest $request)
    {
        // ブラウザで不正に仕込んだinputに対してaxios側で制御出来ない上、フォームリクエストを通過してしまうので
        // ホワイトリスト以外のカラム名は受け付けないように制御 ＊ {last_name: 髙田, first_name: 清雅} の形でPOSTされてくる
        $data = $request->only($this->form_items);

        // DBに登録
        User::create([
            'last_name' => $data['last_name'],
            'first_name' => $data['first_name'],
            'last_name_kana' => $data['last_name_kana'],
            'first_name_kana' => $data['first_name_kana'],
            'gender' => $data['gender'],
            'birthday' => $data['birthday'],
            'post_code' => $data['post_code'],
            'prefecture' => $data['prefecture'],
            'municipality' => $data['municipality'],
            'street_name' => $data['street_name'],
            'street_number' => $data['street_number'],
            'building' => $data['building'],
            'delivery_post_code' => $data['delivery_post_code'],
            'delivery_prefecture' => $data['delivery_prefecture'],
            'delivery_municipality' => $data['delivery_municipality'],
            'delivery_street_name' => $data['delivery_street_name'],
            'delivery_street_number' => $data['delivery_street_number'],
            'delivery_building' => $data['delivery_building'],
            'tel' => $data['tel'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'is_received' => $data['is_received'],
        ]);

        // レスポンスを返却
        return response()->json(['create' => true, 'message' => '会員の新規登録を完了しました'], 200);
    }

    public function edit()
    {
        // レスポンスを返却
        return new UserResource(Auth::guard('user')->user());
    }

    public function update(UserEditRequest $request, User $user)
    {
        // 項目制限
        $data = $request->only($this->form_items);
        // 編集項目をDBに保存
        $user->fill($data)->save();
        // レスポンスを返却
        return response()->json(['update' => true, 'message' => '会員の編集を完了しました'], 200);
    }

    public function destroy(Request $request, User $user)
    {
        // ユーザーの論理削除
        $user->delete();
        // // ユーザーのログアウト
        // Auth::guard('user')->logout();
        // // セッションIDの再発行
        // $request->session()->regenerate();
        // レスポンスを返却
        return response()->json(['delete' => true, 'message' => '会員の削除を完了しました'], 200);
    }
}

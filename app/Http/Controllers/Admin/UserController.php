<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\admin\UserEditRequest;
use App\Http\Requests\admin\UserRegisterRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    // TODO レスポンスの返却形式の統一

    // 該当のカラム以外を扱わないようにホワイトリスト作成
    private $form_items = [
        'last_name', 'first_name', 'last_name_kana', 'first_name_kana', 'gender', 'birthday', 'post_code', 'prefecture', 'municipality', 'street_name', 'street_number', 'building',
        'delivery_post_code', 'delivery_prefecture', 'delivery_municipality', 'delivery_street_name', 'delivery_street_number', 'delivery_building', 'tel', 'email', 'password', 'is_received'
    ];

    public function __construct()
    {
        // Auth認証
        $this->middleware('auth:admin');
    }

    public function index(Request $request)
    {
        $query = User::query();

        if($request->input('perPage')) {
            $per_page = $request->input('perPage');
            //　取得件数が指定されていた場合はpaginationに引数としてわたしてあげる * 数字にキャストしないと返り値が文字列になってしまうので注意
            $users = $query->orderBy('created_at','desc')->paginate((int)$per_page);
        } else {
            // デフォルトの表示件数　１０件
            $users = $query->orderBy('created_at','desc')->paginate(10);
        }

        // レスポンスを返却
        return response()->json(['users' => $users]);
    }

    public function create()
    {
        // とりあえずなんか返す
        return response()->json(['auth' => true]);
    }

    public function store(UserRegisterRequest $request)
    {
        // ブラウザで不正に仕込んだinputに対してaxios側で制御出来ない上、フォームリクエストを通過してしまうので
        //　ホワイトリスト以外のカラム名は受け付けないように制御　＊　{last_name: 髙田, first_name: 清雅} の形でPOSTされてくる
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
        return response()->json(['success' => true]);
    }

    public function show(User $user)
    {
        // レスポンスを返却
        return response()->json(['user' => $user]);
    }

    public function edit(User $user)
    {
        // レスポンスを返却
        return response()->json(['user' => $user]);
    }

    public function update(UserEditRequest $request, User $user)
    {
        // 項目制限
        $data = $request->only($this->form_items);
        // 編集項目をDBに保存
        $user->fill($data)->save();
        // レスポンスを返却
        return response()->json(['success' => true]);
    }

    public function destroy(User $user)
    {
         // 引数にモデルを指定することで渡ってきたIDに該当のインスタンスを生成して受け取れるので、そのまま論理削除
         $user->delete();
         // ユーザーを再取得
         $users = User::all()->take(10);
         // レスポンスを返却
         return response()->json(['users' => $users]);
    }

}

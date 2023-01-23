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
    // TODO Resource APIでレスポンスの返却形式を決めるか要検討
    // TODO フリーワード検索でカラムを指定受けて検索をかける仕様にするか要検討

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
        $search_user = User::query();

        // フリーワード検索
        $search_user->filterKeyword($request, ['last_name', 'first_name', 'last_name_kana', 'first_name_kana']);
        // 性別フィルター
        $search_user->filterGender($request);
        // DM登録の有無フィルター
        $search_user->filterIsReceived($request);
        // 検索期間の指定フィルター
        $search_user->filterDateRange($request);

        // 名前順->生年月日順->作成日順->更新日順の優先順位でソートされる仕組み

        // 名前でソート
        $search_user->orderByName($request);
        // 生年月日でソート
        $search_user->orderByBirthday($request);
        // 作成日でソート
        $search_user->orderByCreatedAt($request);
        // 更新日でソート
        $search_user->orderByUpdatedAt($request);

        // 1ページ当たり件数の指定の有無を確認
        if($request->input('per_page')) {
            $per_page = $request->input('per_page');
            //　取得件数が指定されていた場合はpaginationに引数としてわたしてあげる * 数字にキャストしないと返り値が文字列になってしまうので注意
            $users = $search_user->paginate((int)$per_page);
        } else {
            // 取得件数が未設定の場合はデフォルトの表示件数　１０件
            $users = $search_user->paginate(10);
        }

        // レスポンスを返却
        return response()->json(['users' => $users],200);
    }

    public function create()
    {
        // とりあえずなんか返す
        return response()->json(['read' => true],200);
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
        return response()->json(['create' => true, 'message' => '会員の新規登録を完了しました'], 200);
    }

    public function edit(User $user)
    {
        // レスポンスを返却
        return response()->json(['user' => $user],200);
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

    public function destroy(Request $request)
    {
        // 複数のIDが渡ってくるので全て取得する
        $users = $request->all();

        foreach($users as $user) {
            // インスタンスを生成して削除
            $user = User::find($user);
            $user->delete();
        }
        // レスポンスを返却
        return response()->json(['delete' => true, 'message' => '会員の削除を完了しました'], 200);
    }

    public function csvExport(Request $request)
    {
        // 複数のIDが渡ってくるので全て取得する
        $id = $request->all();
        // 該当のIDのユーザーを取得
        $users = User::select(['last_name', 'first_name', 'last_name_kana', 'first_name_kana', 'gender', 'birthday', 'post_code', 'prefecture', 'municipality', 'street_name', 'street_number', 'building', 'delivery_post_code', 'delivery_prefecture', 'delivery_municipality', 'delivery_street_name', 'delivery_street_number', 'delivery_building', 'tel', 'email', 'is_received', 'created_at', 'updated_at' ])
            ->whereIn('id', $id)->cursor();

        // クロージャの中でエラーが起きても、streamDownloadを呼んだ時点でもうヘッダーとかが返っているのでエラーレスポンスが返せない。
        return response()->streamDownload(function () use ($users) {
            // CSVのヘッダー作成
            $csv_header = ['No','氏名', '氏名（カナ）', '性別', '生年月日', '郵便番号', '住所', '配送先-郵便番号', '配送先-住所', '電話番号', 'メールアドレス', 'DM登録', '作成日時', '更新日時'];
            //　SplFileObjectのインスタンスを生成
            $file = new \SplFileObject('php://output', 'w');
            // EXCEL(デフォルトがShift-JIS形式)で開いた時に日本語が文字化けしないように、UTF-8のBOM付きにするためにBOMを書き込み
            $file->fwrite(pack('C*',0xEF,0xBB,0xBF));
            // ヘッダーの読み込み
            $file->fputcsv($csv_header);
            // 一行ずつ連想配列から値を取り出して配列に格納
            $num = 1;
            foreach ($users as $user){
                $file->fputcsv([
                    $num,                                   // NO
                    $user->full_name,                       // 氏名
                    $user->full_name_kana,                  // 氏名（カナ）
                    $user->gender_text,                     // 性別
                    $user->birthday->format('Y-m-d'),       // 生年月日
                    $user->post_code_text,                  // 郵便番号
                    $user->full_address,                    // 住所
                    $user->delivery_post_code_text,         // 配送先　郵便番号
                    $user->full_delivery_address,           // 配送先　住所
                    $user->tel,                             // 電話番号
                    $user->email,                           // メールアドレス
                    $user->is_received_text,                // DM登録
                    $user->created_at,                      // 作成日時
                    $user->updated_at,                      // 更新日時
                ]);
                $num++;
            }

        }, '顧客情報出力.csv', [
            'Content-Type' => 'text/csv'
        ]);
    }


}

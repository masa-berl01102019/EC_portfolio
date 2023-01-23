<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\admin\UserEditRequest;
use App\Http\Requests\admin\UserRegisterRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
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
        $search_user = User::query();

        // フリーワード検索　TODO カラムを指定して検索をかけるようにするか要検討
        if(!is_null($request->input('f_keyword'))) {
            // 全角スペースを半角スペースに変換
            $keyword = mb_convert_kana($request->input('f_keyword'), 's', 'UTF-8');
            // 前後のスペース削除（trimの対象半角スペースのみなので半角スペースに変換後行う）
            $keyword = trim($keyword);
            // 連続する半角スペースを半角スペースカンマに変換
            $keyword = preg_replace('/\s+/', ',', $keyword);
            // 半角スペース区切りで配列に変換
            $keywords = explode(',',$keyword);

            // テーブル結合してキーワード検索で渡ってきた値と部分一致するアイテムに絞りこみ　DBのカラムが分かれてるのでスペースなしでフルネームで検索されると表示されない！！
            $search_user->where(function ($query) use ($keywords) {
                foreach ($keywords as $keyword) { // 複数のkeywordを検索
                    $query->orWhere('last_name', 'like', "%{$keyword}%")
                        ->orWhere('first_name', 'like', "%{$keyword}%")
                        ->orWhere('last_name_kana', 'like', "%{$keyword}%")
                        ->orWhere('first_name_kana', 'like', "%{$keyword}%");
                }
            });
        }

        // 性別フィルター
        if(!is_null($request->input('f_gender'))) {
            // 全角スペースを半角スペースに変換
            $gender = $request->input('f_gender');
            // 半角スペース区切りで配列に変換
            $gender_arr = explode(',',$gender);

            // テーブル結合してキーワード検索で渡ってきた値と部分一致するアイテムに絞りこみ
            $search_user->where(function ($query) use ($gender_arr) {
                foreach ($gender_arr as $list) { // 複数のkeywordを検索
                    $query->orWhere('gender', "{$list}");
                }
            });
        }

        // DM登録の有無フィルター
        if(!is_null($request->input('f_is_received'))) {
            // 全角スペースを半角スペースに変換
            $is_receiver = $request->input('f_is_received');
            // 半角スペース区切りで配列に変換
            $receiver_arr = explode(',',$is_receiver);

            // テーブル結合してキーワード検索で渡ってきた値と部分一致するアイテムに絞りこみ
            $search_user->where(function ($query) use ($receiver_arr) {
                foreach ($receiver_arr as $list) { // 複数のkeywordを検索
                    $query->orWhere('is_received', "{$list}");
                }
            });
        }

        // 検索期間の指定
        $t = $request->all();
        // array_flip()でkeyとvalueを反転させてpreg_grep()で正規表現を使って該当の連想配列を取り出す * keyとvalueが反転した状態で連想配列が返されてる
        $flip_array = preg_grep( '/f_dr_/', array_flip($t) ); // f_dr_ = 期間指定のフィルタリング　
        // 該当のkeyがあるか条件分岐
        if(!empty($flip_array)) {
            // array_key_first()で最初のキーを取得して変数に格納
            $index = array_key_first($flip_array);
            // keyとvalueが反転してるのでvalueに対してstr_replace()でプレフィックスを取り除いてカラム名を取得
            $column_name = str_replace('f_dr_', '', $flip_array[$index]);
            // keyとvalueが反転してるのでkeyには日付が「検索開始日,検索終了日」の形で入ってるのでexplode()で配列に変換
            $date_array = explode(',',$index);
            try {
                $begin = new Carbon($date_array[0]);
                $end = new Carbon($date_array[1]);
                // 開始日と終了日をwhereBetween()でクエリに追加
                $search_user->whereBetween($column_name, [$begin,$end]);
            } catch(\Exception $e) { // TODO エラーハンドリングの統一する
                // 例外の結果をログ書き出し
                report($e);
                // json形式でエラーを返却
                return response()->json([
                    'status' => 400,
                    'errors' => $e->getMessage()
                ], 400);
            }
        }

        // 名前順->生年月日順->作成日順->更新日順の優先順位でソートされる仕組み

        // 名前でソート
        if(!is_null($request->input('last_name_kana'))) {
            $sort = $request->input('last_name_kana');
            $search_user->orderBy('last_name_kana', $sort)->orderBy('first_name_kana', $sort);
        }

        // 生年月日でソート　
        if(!is_null($request->input('birthday'))) {
            $sort = $request->input('birthday');
            $search_user->orderBy('birthday', $sort);
        }

        // 作成日でソート
        if(!is_null($request->input('created_at'))) {
            $sort = $request->input('created_at');
            $search_user->orderBy('created_at', $sort);
        }

        // 更新日でソート
        if(!is_null($request->input('updated_at'))) {
            $sort = $request->input('updated_at');
            $search_user->orderBy('updated_at', $sort);
        }

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
        return response()->json(['delete' => true]);
    }

    public function csvExport(Request $request)
    {
        // 複数のIDが渡ってくるので全て取得する
        $id = $request->all();
        // 該当のIDのユーザーを取得
        $users = User::select(['last_name', 'first_name', 'last_name_kana', 'first_name_kana', 'gender', 'birthday', 'post_code', 'prefecture', 'municipality', 'street_name', 'street_number', 'building', 'delivery_post_code', 'delivery_prefecture', 'delivery_municipality', 'delivery_street_name', 'delivery_street_number', 'delivery_building', 'tel', 'email' ])
            ->whereIn('id', $id)->cursor();

        // クロージャの中でエラーが起きても、streamDownloadを呼んだ時点でもうヘッダーとかが返っているのでエラーレスポンスが返せない。
        return response()->streamDownload(function () use ($users) {
            // CSVのヘッダー作成
            $csv_header = ['姓', '名', '姓（カナ）', '名（カナ）', '性別', '誕生日', '郵便番号', '都道府県', '市区町村郡', '町名', '丁目番地', '建物名', '配達先-郵便番号', '配達先-都道府県', '配達先-市区町村郡', '配達先-町名', '配達先-丁目番地', '配達先-建物名', '電話番号', 'メールアドレス'];
            //　SplFileObjectのインスタンスを生成
            $file = new \SplFileObject('php://output', 'w');
            // EXCEL(デフォルトがShift-JIS形式)で開いた時に日本語が文字化けしないように、UTF-8のBOM付きにするためにBOMを書き込み
            $file->fwrite(pack('C*',0xEF,0xBB,0xBF));
            // ヘッダーの読み込み
            $file->fputcsv($csv_header);
            // 一行ずつ連想配列から値を取り出して配列に格納
            foreach ($users as $user){
                $file->fputcsv([
                    $user->last_name,              // 姓
                    $user->first_name,             // 名
                    $user->last_name_kana,         // 姓（カナ）
                    $user->first_name_kana,        // 名（カナ）
                    $user->gender,                 // 性別
                    $user->birthday,               // 誕生日
                    $user->post_code,              // 郵便番号
                    $user->prefecture,             // 都道府県
                    $user->municipality,           // 市区町村郡
                    $user->street_name,            // 町名
                    $user->street_number,          // 丁目番地
                    $user->building,               // 建物名
                    $user->delivery_post_code,     // 配達先　郵便番号
                    $user->delivery_prefecture,    // 配達先　都道府県
                    $user->delivery_municipality,  // 配達先　市区町村番地
                    $user->delivery_street_name,   // 配達先　町名
                    $user->delivery_street_number, // 配達先　丁目番地
                    $user->delivery_building,      // 配達先　建物名
                    $user->tel,                    // 電話番号
                    $user->email,                  // メールアドレス
                ]);
            }

        }, '顧客情報出力.csv', [
            'Content-Type' => 'text/csv',
        ]);
    }


}

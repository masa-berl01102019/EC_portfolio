<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\admin\AdminEditRequest;
use App\Http\Requests\admin\AdminRegisterRequest;
use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    // TODO レスポンスの返却形式の統一
    // TODO エラーハンドリングの統一 * auth認証されてない場合等のエラーと入力バリデーション等のエラーは出しどころを分ける必要あり
    // TODO フリーワード検索　カラムを指定して検索をかけるようにするか要検討
    // TODO 他のコントローラーでも使用する共通処理をヘルパー関数でまとめる

    // 該当のカラム以外を扱わないようにホワイトリスト作成
    private $form_items = ['last_name', 'first_name', 'last_name_kana', 'first_name_kana', 'tel', 'email', 'password'];

    public function __construct()
    {
        // Auth認証
        $this->middleware('auth:admin');
    }

    public function index(Request $request)
    {
        $search_admin = Admin::query();

        // フリーワード検索
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
            $search_admin->where(function ($query) use ($keywords) {
                foreach ($keywords as $keyword) { // 複数のkeywordを検索
                    $query->orWhere('last_name', 'like', "%{$keyword}%")
                        ->orWhere('first_name', 'like', "%{$keyword}%")
                        ->orWhere('last_name_kana', 'like', "%{$keyword}%")
                        ->orWhere('first_name_kana', 'like', "%{$keyword}%");
                }
            });
        }

        // 検索期間の指定
        $target = $request->all();
        // array_flip()でkeyとvalueを反転させてpreg_grep()で正規表現を使って該当の連想配列を取り出す * keyとvalueが反転した状態で連想配列が返されてる
        $flip_array = preg_grep( '/f_dr_/', array_flip($target) ); // f_dr_ = 期間指定のフィルタリング　
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
                $search_admin->whereBetween($column_name, [$begin,$end]);
            } catch(\Exception $e) {
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
            $search_admin->orderBy('last_name_kana', $sort)->orderBy('first_name_kana', $sort);
        }

        // 作成日でソート
        if(!is_null($request->input('created_at'))) {
            $sort = $request->input('created_at');
            $search_admin->orderBy('created_at', $sort);
        }

        // 更新日でソート
        if(!is_null($request->input('updated_at'))) {
            $sort = $request->input('updated_at');
            $search_admin->orderBy('updated_at', $sort);
        }

        // 1ページ当たり件数の指定の有無を確認
        if($request->input('per_page')) {
            $per_page = $request->input('per_page');
            //　取得件数が指定されていた場合はpaginationに引数としてわたしてあげる * 数字にキャストしないと返り値が文字列になってしまうので注意
            $admins = $search_admin->paginate((int)$per_page);
        } else {
            // 取得件数が未設定の場合はデフォルトの表示件数　１０件
            $admins = $search_admin->paginate(10);
        }

        // レスポンスを返却
        return response()->json(['admins' => $admins ]);
    }

    public function create()
    {
        // とりあえずなんか返す
        return response()->json(['auth' => true]);
    }

    public function store(AdminRegisterRequest $request)
    {
        // ブラウザで不正に仕込んだinputに対してaxios側で制御出来ない上、フォームリクエストを通過してしまうので
        //　ホワイトリスト以外のカラム名は受け付けないように制御　＊　{last_name: 髙田, first_name: 清雅} の形でPOSTされてくる
        $data = $request->only($this->form_items);

        // DBに登録
        Admin::create([
            'last_name' => $data['last_name'],
            'first_name' => $data['first_name'],
            'last_name_kana' => $data['last_name_kana'],
            'first_name_kana' => $data['first_name_kana'],
            'tel' => $data['tel'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);
        // レスポンスを返却
        return response()->json(['success' => true]);
    }

    public function edit(Admin $admin)
    {
        // レスポンスを返却
        return response()->json(['admin' => $admin]);
    }

    public function update(AdminEditRequest $request, Admin $admin)
    {
        // 項目制限
        $data = $request->only($this->form_items);
        // 編集項目をDBに保存
        $admin->fill($data)->save();
        // レスポンスを返却
        return response()->json(['success' => true]);
    }

    public function destroy(Request $request)
    {
        // 複数のIDが渡ってくるので全て取得する
        $admins = $request->all();

        foreach($admins as $admin) {
            // インスタンスを生成して削除
            $admin = Admin::find($admin);
            $admin->delete();
        }
        // レスポンスを返却
        return response()->json(['delete' => true]);
    }

    public function csvExport(Request $request)
    {
        // 複数のIDが渡ってくるので全て取得する
        $id = $request->all();
        // 該当のIDのユーザーを取得
        $admins = Admin::select(['last_name', 'first_name', 'last_name_kana', 'first_name_kana', 'tel', 'email', 'created_at', 'updated_at' ])
            ->whereIn('id', $id)->cursor();

        // クロージャの中でエラーが起きても、streamDownloadを呼んだ時点でもうヘッダーとかが返っているのでエラーレスポンスが返せない。
        return response()->streamDownload(function () use ($admins) {
            // CSVのヘッダー作成
            $csv_header = ['No','氏名', '氏名（カナ）', '電話番号', 'メールアドレス', '作成日時', '更新日時'];
            //　SplFileObjectのインスタンスを生成
            $file = new \SplFileObject('php://output', 'w');
            // EXCEL(デフォルトがShift-JIS形式)で開いた時に日本語が文字化けしないように、UTF-8のBOM付きにするためにBOMを書き込み
            $file->fwrite(pack('C*',0xEF,0xBB,0xBF));
            // ヘッダーの読み込み
            $file->fputcsv($csv_header);
            // 一行ずつ連想配列から値を取り出して配列に格納
            $num = 1;
            foreach ($admins as $admin){
                $file->fputcsv([
                    $num,                                    // NO
                    $admin->full_name,                       // 氏名
                    $admin->full_name_kana,                  // 氏名（カナ）
                    $admin->tel,                             // 電話番号
                    $admin->email,                           // メールアドレス
                    $admin->created_at->format('Y-m-d H:m'), // 作成日時
                    $admin->updated_at->format('Y-m-d H:m'), // 更新日時
                ]);
                $num++;
            }

        }, '管理者情報出力.csv', [
            'Content-Type' => 'text/csv'
        ]);
    }


}

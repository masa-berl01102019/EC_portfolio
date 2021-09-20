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
    // TODO Resource APIでレスポンスの返却形式を決めるか要検討
    // TODO フリーワード検索でカラムを指定受けて検索をかける仕様にするか要検討

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
        $search_admin->filterKeyword($request, ['last_name', 'first_name', 'last_name_kana', 'first_name_kana']);
        // 検索期間の指定フィルター
        $search_admin->filterDateRange($request);

        // 名前順->作成日順->更新日順の優先順位でソートされる仕組み

        // 名前でソート
        $search_admin->orderByName($request);
        // 作成日でソート
        $search_admin->orderByCreatedAt($request);
        // 更新日でソート
        $search_admin->orderByUpdatedAt($request);

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
        return response()->json(['admins' => $admins], 200);
    }

    public function create()
    {
        // レスポンスを返却
        return response()->json(['read' => true], 200);
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
        return response()->json(['create' => true, 'message' => '管理者の新規登録を完了しました'], 200);
    }

    public function edit(Admin $admin)
    {
        // レスポンスを返却
        return response()->json(['admin' => $admin], 200);
    }

    public function update(AdminEditRequest $request, Admin $admin)
    {
        // 項目制限
        $data = $request->only($this->form_items);
        // 編集項目をDBに保存
        $admin->fill($data)->save();
        // レスポンスを返却
        return response()->json(['update' => true, 'message' => '管理者の編集を完了しました'], 200);
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
        return response()->json(['delete' => true, 'message' => '管理者の削除を完了しました'], 200);
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
                    $admin->created_at,                      // 作成日時
                    $admin->updated_at,                      // 更新日時
                ]);
                $num++;
            }

        }, '管理者情報出力.csv', [
            'Content-Type' => 'text/csv'
        ]);
    }


}

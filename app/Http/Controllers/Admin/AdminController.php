<?php

namespace App\Http\Controllers\Admin;

use App\Models\Admin;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use App\Http\Resources\AdminResource;
use App\Http\Requests\admin\AdminEditRequest;
use App\Http\Requests\admin\AdminRegisterRequest;

class AdminController extends Controller
{
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

        // ページネーション
        $admins = $search_admin->customPaginate($request);

        // レスポンスを返却
        return AdminResource::collection($admins);
    }

    public function store(AdminRegisterRequest $request)
    {
        // ブラウザで不正に仕込んだinputに対してaxios側で制御出来ない上、フォームリクエストを通過してしまうので
        // ホワイトリスト以外のカラム名は受け付けないように制御 ＊ {last_name: 髙田, first_name: 清雅} の形でPOSTされてくる
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
        return new AdminResource ($admin);
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
        $admins = Admin::whereIn('id', $id)->cursor();
        // 配列の初期化
        $csv_body = [];
        // CSVに必要な項目を配列に格納
        $num = 1;
        foreach ($admins as $admin){
            $csv_body[] = [
                $num,
                $admin->id,
                $admin->full_name.'('.$admin->full_name_kana.')',
                $admin->tel,
                $admin->email,
                $admin->created_at,
                $admin->updated_at,
            ];
            $num++;
        }
        // headerの作成
        $csv_header = ['No', 'ID', '氏名', '電話番号', 'メールアドレス', '作成日時', '更新日時'];
        // 独自helper関数呼び出し
        return csvExport($csv_body,$csv_header,'管理者情報出力.csv');
    }


}

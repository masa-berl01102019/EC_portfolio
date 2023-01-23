<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\admin\ContactRequest;
use App\Models\Admin;
use App\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;

class ContactController extends Controller
{
    // TODO Resource APIでレスポンスの返却形式を決めるか要検討
    // TODO フリーワード検索でカラムを指定受けて検索をかける仕様にするか要検討

    // 該当のカラム以外を扱わないようにホワイトリスト作成
    private $form_items = [ 'user_id', 'response_status', 'memo' ];

    public function __construct()
    {
        // Auth認証
        $this->middleware('auth:admin');
    }

    public function index(Request $request)
    {
        $search_contact = Contact::query()
            ->select(
                'contacts.id', 'user_id','admin_id', 'contacts.last_name', 'contacts.first_name', 'contacts.last_name_kana', 'contacts.first_name_kana',
                'contacts.tel', 'contacts.email', 'title', 'body', 'response_status', 'contacts.created_at', 'contacts.updated_at','memo',
                'admins.last_name as admin_last_name', 'admins.first_name as admin_first_name', 'admins.last_name_kana as admin_last_name_kana', 'admins.first_name_kana as admin_first_name_kana'
            )->leftjoin('admins', 'admins.id', '=', 'contacts.admin_id');

        // フリーワード検索
        $search_contact->filterKeyword($request, ['contacts.last_name', 'contacts.first_name', 'contacts.last_name_kana', 'contacts.first_name_kana']);
        // 検索期間の指定フィルター
        $search_contact->filterDateRange($request, 'contacts');
        // 対応ステータスの有無フィルター
        $search_contact->filterResponseStatus($request);

        // 名前順->掲載終了日順->投稿日順->更新日順の優先順位でソートされる仕組み

        // 名前でソート
        $search_contact->orderByName($request);
        // 作成日でソート
        $search_contact->orderByCreatedAt($request);
        // 更新日でソート
        $search_contact->orderByUpdatedAt($request);


        // 1ページ当たり件数の指定の有無を確認
        if($request->input('per_page')) {
            $per_page = $request->input('per_page');
            //　取得件数が指定されていた場合はpaginationに引数としてわたしてあげる * 数字にキャストしないと返り値が文字列になってしまうので注意
            $contacts = $search_contact->paginate((int)$per_page);
        } else {
            // 取得件数が未設定の場合はデフォルトの表示件数　１０件
            $contacts = $search_contact->paginate(10);
        }

        // レスポンスを返却
        return response()->json(['contacts' => $contacts],200);
    }

    public function edit(Contact $contact)
    {
        // レスポンスを返却
        return response()->json(['contact' => $contact],200);
    }

    public function update(ContactRequest $request, Contact $contact)
    {
        // 項目制限
        $data = $request->only($this->form_items);

        // 編集項目をDBに保存
        $contact->fill([
            'admin_id' => Auth::guard('admin')->id(),
            'response_status' => $data['response_status'],
            'memo' => $data['memo'],
            'updated_at' => Carbon::now(),
        ])->save();

        // レスポンスを返却
        return response()->json(['update' => true, 'message' => 'お問い合わせの編集を完了しました'], 200);
    }

    public function destroy(Request $request)
    {
        // 複数のIDが渡ってくるので全て取得する
        $contacts = $request->all();

        foreach($contacts as $contact) {
            // インスタンスを生成して削除
            $contact = Contact::find($contact);
            $contact->delete();
        }
        // レスポンスを返却
        return response()->json(['delete' => true, 'message' => 'お問い合わせの削除を完了しました'], 200);
    }

    public function csvExport(Request $request)
    {
        // 複数のIDが渡ってくるので全て取得する
        $id = $request->all();
        // 該当のIDのお問い合わせを取得
        $contacts = Contact::query()
            ->select('contacts.id', 'user_id', 'admin_id', 'last_name', 'first_name', 'last_name_kana', 'first_name_kana', 'tel', 'email', 'title', 'body', 'response_status', 'memo', 'created_at', 'updated_at' )
            ->whereIn('contacts.id', $id)
            ->cursor();

        // クロージャの中でエラーが起きても、streamDownloadを呼んだ時点でもうヘッダーとかが返っているのでエラーレスポンスが返せない。
        return response()->streamDownload(function () use ($contacts) {
            // CSVのヘッダー作成
            $csv_header = ['No', '会員ID', '氏名', '氏名(カナ)', '電話番号', 'メールアドレス', 'お問い合わせ日', 'タイトル', 'お問い合わせ内容', '対応状況', '対応者', '備考欄', '対応日'];
            //　SplFileObjectのインスタンスを生成
            $file = new \SplFileObject('php://output', 'w');
            // EXCEL(デフォルトがShift-JIS形式)で開いた時に日本語が文字化けしないように、UTF-8のBOM付きにするためにBOMを書き込み
            $file->fwrite(pack('C*',0xEF,0xBB,0xBF));
            // ヘッダーの読み込み
            $file->fputcsv($csv_header);
            // 一行ずつ連想配列から値を取り出して配列に格納
            $num = 1;
            foreach ($contacts as $contact){
                // 更新者のインスタンス作成
                $admin = Admin::find($contact->admin_id);
                // 更新者の名前を変数に格納
                $admin_name = $admin->full_name.'('.$admin->full_name_kana.')';

                $file->fputcsv([
                    $num,
                    $contact->user_id,
                    $contact->full_name,
                    $contact->full_name_kana,
                    $contact->tel,
                    $contact->email,
                    $contact->created_at,
                    $contact->title,
                    $contact->body,
                    $contact->response_status_text,
                    $admin_name,
                    $contact->memo,
                    $contact->updated_at,
                ]);
                $num++;
            }

        }, 'お問い合わせ情報出力.csv', [
            'Content-Type' => 'text/csv'
        ]);
    }

}

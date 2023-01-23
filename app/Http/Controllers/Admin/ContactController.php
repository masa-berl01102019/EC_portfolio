<?php

namespace App\Http\Controllers\Admin;

use App\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\ContactResource;
use App\Http\Requests\admin\ContactRequest;

class ContactController extends Controller
{
    // TODO 新規登録時にログインしていたらidを渡す実装
    // 該当のカラム以外を扱わないようにホワイトリスト作成
    private $form_items = [ 'user_id', 'response_status', 'memo' ];

    public function __construct()
    {
        // Auth認証
        $this->middleware('auth:admin');
    }

    public function index(Request $request)
    {
        $search_contact = Contact::with('admin');

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

        // ページネーション
        $contacts = $search_contact->customPaginate($request);

        // レスポンスを返却
        return ContactResource::collection($contacts);
    }

    public function edit(Contact $contact)
    {
        // レスポンスを返却
        return new ContactResource ($contact);
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
        // 該当のIDのユーザーを取得
        $contacts = Contact::whereIn('id', $id)->with('admin')->cursor();
        // 配列の初期化
        $csv_body = [];
        // CSVに必要な項目を配列に格納
        $num = 1;
        foreach ($contacts as $contact){
            $csv_body[] = [
                $num,
                $contact->id,
                $contact->user_id ? $contact->user_id: null,
                $contact->full_name,
                $contact->full_name_kana,
                $contact->tel,
                $contact->email,
                $contact->created_at,
                $contact->title,
                $contact->body,
                $contact->response_status_text,
                $contact->admin ? $contact->admin->full_name.'('.$contact->admin->full_name_kana.')' : null,
                $contact->memo ? $contact->memo : null,
                $contact->updated_at,
            ];
            $num++;
        }
        // headerの作成
        $csv_header = ['No', 'ID', '会員ID', '氏名', '氏名(カナ)', '電話番号', 'メールアドレス', 'お問い合わせ日', 'タイトル', 'お問い合わせ内容', '対応状況', '対応者', '備考欄', '対応日'];
        // 独自helper関数呼び出し
        return csvExport($csv_body,$csv_header,'お問い合わせ情報出力.csv');
    }

}

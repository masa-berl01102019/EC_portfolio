<?php

namespace App\Http\Controllers\Admin;

use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\NotificationResource;
use App\Http\Requests\admin\NotificationRequest;

class NotificationController extends Controller
{
    // 該当のカラム以外を扱わないようにホワイトリスト作成
    private $form_items = [ 'admin_id', 'title', 'body', 'is_published', 'expired_at', 'posted_at', 'modified_at' ];

    public function __construct()
    {
        // Auth認証
        $this->middleware('auth:admin');
    }

    public function index(Request $request)
    {
        $search_notification = Notification::with('admin');

        // フリーワード検索
        $search_notification->filterKeyword($request, ['title']);
        // 検索期間の指定フィルター
        $search_notification->filterDateRange($request);
        // 公開の有無フィルター
        $search_notification->filterIsPublished($request);

        // 名前順->掲載終了日順->投稿日順->更新日順の優先順位でソートされる仕組み

        // 名前でソート
        $search_notification->orderByName($request);
        // 掲載終了日でソート
        $search_notification->orderByExpiredAt($request);
        // 投稿日でソート
        $search_notification->orderByPostedAt($request);
        // 修正更新日でソート
        $search_notification->orderByModifiedAt($request);

        // ページネーション
        $notifications = $search_notification->customPaginate($request);

        // レスポンスを返却
        return NotificationResource::collection($notifications);
    }

    public function store(NotificationRequest $request)
    {
        // ブラウザで不正に仕込んだinputに対してaxios側で制御出来ない上、フォームリクエストを通過してしまうので
        // ホワイトリスト以外のカラム名は受け付けないように制御 ＊ {last_name: 髙田, first_name: 清雅} の形でPOSTされてくる
        $data = $request->only($this->form_items);

        // DBに登録
        Notification::create([
            'admin_id' => Auth::guard('admin')->id(),
            'title' => $data['title'],
            'body' => $data['body'],
            'is_published' => $data['is_published'],
            'expired_at' => $data['expired_at'],
            'posted_at' => $data['is_published'] == 1 ? Carbon::now(): null, // 初公開された投稿日だけを登録したいので条件分岐を追加
        ]);
        // レスポンスを返却
        return response()->json(['create' => true, 'message' => 'お知らせの新規登録を完了しました'], 200);
    }

    public function edit(Notification $notification)
    {
        // レスポンスを返却
        return new NotificationResource($notification);
    }

    public function update(NotificationRequest $request, Notification $notification)
    {
        // 項目制限
        $data = $request->only($this->form_items);

        // 初回登録時に非公開の状態で保存されている場合もあるのでカラム名の出し分け
        $registered_date = $notification->posted_at !== null ? 'modified_at': 'posted_at';
        // 編集した内容を非公開で保存する場合は日付を更新したくないので該当インスタンスに登録されてる日付を取得
        $date = $registered_date === 'modified_at'? $notification->modified_at : $notification->posted_at;

        // 編集項目をDBに保存
        $notification->fill([
            'admin_id' => Auth::guard('admin')->id(),
            'title' => $data['title'],
            'body' => $data['body'],
            'is_published' => $data['is_published'],
            'expired_at' => $data['expired_at'],
            $registered_date => $data['is_published'] == 1 ? Carbon::now(): $date, // 公開日ベースで更新日を保存したいので条件分岐を追加
        ])->save();

        // レスポンスを返却
        return response()->json(['update' => true, 'message' => 'お知らせの編集を完了しました'], 200);
    }

    public function destroy(Request $request)
    {
        // 複数のIDが渡ってくるので全て取得する
        $notifications = $request->all();

        foreach($notifications as $notification) {
            // インスタンスを生成して削除
            $notification = Notification::find($notification);
            $notification->delete();
        }
        // レスポンスを返却
        return response()->json(['delete' => true, 'message' => 'お知らせの削除を完了しました'], 200);
    }

    public function csvExport(Request $request)
    {
        // 複数のIDが渡ってくるので全て取得する
        $id = $request->all();
        // 該当のIDのお知らせを取得
        $notifications = Notification::whereIn('id', $id)->with('admin')->cursor();
        // 配列の初期化
        $csv_body = [];
        // CSVに必要な項目を配列に格納
        $num = 1;
        foreach ($notifications as $notification){
            $csv_body[] = [
                $num,
                $notification->id,
                $notification->is_published_text,
                $notification->title,
                $notification->body,
                $notification->admin->full_name.'('.$notification->admin->full_name_kana.')',
                $notification->expired_at !== null ? $notification->expired_at->format('Y/m/d H:i'): '　　',
                $notification->posted_at !== null ? $notification->posted_at->format('Y/m/d H:i'): '　　',
                $notification->modified_at !== null ? $notification->modified_at->format('Y/m/d H:i'): '　　',
            ];
            $num++;
        }
        // headerの作成
        $csv_header = ['No','ID', '公開状況', 'タイトル', '本文', '最終更新者','掲載終了日', '投稿日', '更新日'];
        // 独自helper関数呼び出し
        return csvExport($csv_body,$csv_header,'お知らせ情報出力.csv');
    }
}

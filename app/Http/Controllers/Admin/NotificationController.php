<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\admin\NotificationRequest;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    // TODO Resource APIでレスポンスの返却形式を決めるか要検討
    // TODO フリーワード検索でカラムを指定受けて検索をかける仕様にするか要検討

    // 該当のカラム以外を扱わないようにホワイトリスト作成
    private $form_items = [ 'admin_id', 'title', 'body', 'is_published', 'expired_at', 'posted_at', 'modified_at' ];

    public function __construct()
    {
        // Auth認証
        $this->middleware('auth:admin');
    }

    public function index(Request $request)
    {
        $search_notification = Notification::query()
            ->select('notifications.id', 'title', 'body', 'is_published', 'expired_at', 'posted_at', 'modified_at', 'admins.last_name', 'admins.first_name', 'admins.last_name_kana', 'admins.first_name_kana')
            ->join('admins','admins.id', '=', 'notifications.admin_id');

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

        // 1ページ当たり件数の指定の有無を確認
        if($request->input('per_page')) {
            $per_page = $request->input('per_page');
            //　取得件数が指定されていた場合はpaginationに引数としてわたしてあげる * 数字にキャストしないと返り値が文字列になってしまうので注意
            $notifications = $search_notification->paginate((int)$per_page);
        } else {
            // 取得件数が未設定の場合はデフォルトの表示件数　１０件
            $notifications = $search_notification->paginate(10);
        }

        // レスポンスを返却
        return response()->json(['notifications' => $notifications ]);
    }

    public function create()
    {
        // とりあえずなんか返す
        return response()->json(['auth' => true]);
    }

    public function store(NotificationRequest $request)
    {
        // ブラウザで不正に仕込んだinputに対してaxios側で制御出来ない上、フォームリクエストを通過してしまうので
        //　ホワイトリスト以外のカラム名は受け付けないように制御　＊　{last_name: 髙田, first_name: 清雅} の形でPOSTされてくる
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
        return response()->json(['success' => true]);
    }

    public function edit(Notification $notification)
    {
        // レスポンスを返却
        return response()->json(['notification' => $notification]);
    }

    public function update(NotificationRequest $request, Notification $notification)
    {
        // 項目制限
        $data = $request->only($this->form_items);

        // 初回登録時に非公開の状態で保存されている場合もあるのでカラム名の出し分け
        $registered_date = $notification->posted_at !== null ? 'modified_at': 'posted_at';

        // 編集項目をDBに保存
        $notification->fill([
            'admin_id' => Auth::guard('admin')->id(),
            'title' => $data['title'],
            'body' => $data['body'],
            'is_published' => $data['is_published'],
            'expired_at' => $data['expired_at'],
            $registered_date => $data['is_published'] == 1 ? Carbon::now(): null, // 公開日ベースで更新日を保存したいので条件分岐を追加
        ])->save();

        // レスポンスを返却
        return response()->json(['success' => true]);
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
        return response()->json(['delete' => true]);
    }

    public function csvExport(Request $request)
    {
        // 複数のIDが渡ってくるので全て取得する
        $id = $request->all();
        // 該当のIDのお知らせを取得
        $notifications = Notification::query()
            ->select('notifications.id', 'title', 'body', 'is_published', 'expired_at', 'posted_at', 'modified_at', 'admins.last_name', 'admins.first_name', 'admins.last_name_kana', 'admins.first_name_kana')
            ->join('admins','admins.id', '=', 'notifications.admin_id')
            ->whereIn('notifications.id', $id)
            ->cursor();

        // クロージャの中でエラーが起きても、streamDownloadを呼んだ時点でもうヘッダーとかが返っているのでエラーレスポンスが返せない。
        return response()->streamDownload(function () use ($notifications) {
            // CSVのヘッダー作成
            $csv_header = ['No', '公開状況', 'タイトル', '最終更新者', '本文', '掲載終了日', '投稿日', '更新日'];
            //　SplFileObjectのインスタンスを生成
            $file = new \SplFileObject('php://output', 'w');
            // EXCEL(デフォルトがShift-JIS形式)で開いた時に日本語が文字化けしないように、UTF-8のBOM付きにするためにBOMを書き込み
            $file->fwrite(pack('C*',0xEF,0xBB,0xBF));
            // ヘッダーの読み込み
            $file->fputcsv($csv_header);
            // 一行ずつ連想配列から値を取り出して配列に格納
            $num = 1;
            foreach ($notifications as $notification){
                // 更新者名を変数に格納
                $last_editor = $notification->last_name.' '.$notification->first_name.'('.$notification->last_name_kana.' '.$notification->first_name_kana.')';

                $file->fputcsv([
                    $num,
                    $notification->is_published_text,
                    $notification->title,
                    $last_editor,
                    $notification->body,
                    $notification->expired_at !== null ? $notification->expired_at->format('Y-m-d'): '　　',
                    $notification->posted_at !== null ? $notification->posted_at->format('Y-m-d'): '　　',
                    $notification->modified_at !== null ? $notification->modified_at->format('Y-m-d'): '　　',
                ]);
                $num++;
            }

        }, 'お知らせ情報出力.csv', [
            'Content-Type' => 'text/csv'
        ]);
    }
}

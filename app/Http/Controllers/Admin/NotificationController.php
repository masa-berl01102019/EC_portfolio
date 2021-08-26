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
    // TODO レスポンスの返却形式の統一
    // TODO エラーハンドリングの統一 * auth認証されてない場合等のエラーと入力バリデーション等のエラーは出しどころを分ける必要あり
    // TODO フリーワード検索　カラムを指定して検索をかけるようにするか要検討
    // TODO 他のコントローラーでも使用する共通処理をヘルパー関数でまとめる
    // TODO APIではAuthファサード使ったログイン者情報の取得が出来ないので認証周りの修正する
    // TODO indexで管理者の名前順ソート機能追加
    // TODO レコードの保存と編集の修正と動作確認
    // TODO CSVに最終更新者名を追加

    // 該当のカラム以外を扱わないようにホワイトリスト作成
    private $form_items = [ 'admin_id', 'title', 'body', 'is_published', 'expired_at', 'posted_at', 'modified_at' ];

    public function __construct()
    {
        // Auth認証
        $this->middleware('auth:admin');
    }

    public function index(Request $request)
    {
        $search_notification = Notification::query();

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
            $search_notification->where(function ($query) use ($keywords) {
                foreach ($keywords as $keyword) { // 複数のkeywordを検索
                    $query->orWhere('title', 'like', "%{$keyword}%")
                        ->orWhere('title', 'like', "%{$keyword}%")
                        ->orWhere('title', 'like', "%{$keyword}%")
                        ->orWhere('title', 'like', "%{$keyword}%");
                }
            });
        }

        // 公開の有無フィルター
        if(!is_null($request->input('f_is_published'))) {
            // 全角スペースを半角スペースに変換
            $is_published = $request->input('f_is_published');
            // 半角スペース区切りで配列に変換
            $published_arr = explode(',',$is_published);

            // テーブル結合してキーワード検索で渡ってきた値と部分一致するアイテムに絞りこみ
            $search_notification->where(function ($query) use ($published_arr) {
                foreach ($published_arr as $list) { // 複数のkeywordを検索
                    $query->orWhere('is_published', "{$list}");
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
                $search_notification->whereBetween($column_name, [$begin,$end]);
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

        // 名前順->掲載終了日順->投稿日順->更新日順の優先順位でソートされる仕組み

        // 名前でソート
//        if(!is_null($request->input('last_name_kana'))) {
//            $sort = $request->input('last_name_kana');
//            $search_notification->orderBy('last_name_kana', $sort)->orderBy('first_name_kana', $sort);
//        }

        // 掲載終了日でソート
        if(!is_null($request->input('expired_at'))) {
            $sort = $request->input('expired_at');
            $search_notification->orderBy('expired_at', $sort);
        }

        // 投稿日でソート　
        if(!is_null($request->input('posted_at'))) {
            $sort = $request->input('posted_at');
            $search_notification->orderBy('posted_at', $sort);
        }

        // 更新日でソート
        if(!is_null($request->input('modified_at'))) {
            $sort = $request->input('modified_at');
            $search_notification->orderBy('modified_at', $sort);
        }

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
            'admin_id' => Auth::id(),
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
        $notifications = Notification::select(['is_published', 'title', 'body', 'expired_at', 'posted_at', 'modified_at'])
            ->whereIn('id', $id)->cursor();

        // クロージャの中でエラーが起きても、streamDownloadを呼んだ時点でもうヘッダーとかが返っているのでエラーレスポンスが返せない。
        return response()->streamDownload(function () use ($notifications) {
            // CSVのヘッダー作成
            $csv_header = ['No', '公開状況', 'タイトル', '本文', '掲載終了日', '投稿日', '更新日'];
            //　SplFileObjectのインスタンスを生成
            $file = new \SplFileObject('php://output', 'w');
            // EXCEL(デフォルトがShift-JIS形式)で開いた時に日本語が文字化けしないように、UTF-8のBOM付きにするためにBOMを書き込み
            $file->fwrite(pack('C*',0xEF,0xBB,0xBF));
            // ヘッダーの読み込み
            $file->fputcsv($csv_header);
            // 一行ずつ連想配列から値を取り出して配列に格納
            $num = 1;
            foreach ($notifications as $notification){
                $file->fputcsv([
                    $num,
                    $notification->ac_is_published,
                    $notification->title,
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

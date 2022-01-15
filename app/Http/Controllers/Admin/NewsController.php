<?php

namespace App\Http\Controllers\Admin;

use Throwable;
use App\Models\Tag;
use App\Models\News;
use App\Models\Brand;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\admin\NewsEditRequest;
use App\Http\Requests\admin\NewsRegisterRequest;

class NewsController extends Controller
{
    // TODO Resource APIでレスポンスの返却形式を決めるか要検討
    // TODO フリーワード検索でカラムを指定受けて検索をかける仕様にするか要検討

    // 該当のカラム以外を扱わないようにホワイトリスト作成
    private $form_items = [ 'title', 'body', 'brand_id', 'category_id', 'items_id', 'tags_id', 'is_published', 'file', 'thumbnail'];

    public function __construct()
    {
        // Auth認証
        $this->middleware('auth:admin');
    }

    public function index(Request $request)
    {
        $search_news = News::select(['news.id', 'title', 'thumbnail', 'is_published', 'posted_at', 'modified_at', 'brand_id', 'admin_id', 'category_id'])->with([
            'admin:id,first_name,last_name,first_name_kana,last_name_kana',
            'brand:id,brand_name',
            'tags:id,tag_name'
        ]);

        // フリーワード検索
        $search_news->filterKeyword($request, ['title']);
        // 検索期間の指定フィルター
        $search_news->filterDateRange($request);
        // 公開の有無フィルター
        $search_news->filterIsPublished($request);
        // ブランドのフィルター
        $search_news->filterBrand($request);
        // カテゴリのフィルター
        $search_news->filterGenderCategory($request);
        // タグのフィルター
        $search_news->filterTag($request);

        // 投稿日順->更新日順の優先順位でソートされる仕組み

        // 投稿日でソート
        $search_news->orderByPostedAt($request);
        // 修正更新日でソート
        $search_news->orderByModifiedAt($request);

        // 1ページ当たり件数の指定の有無を確認
        if($request->input('per_page')) {
            $per_page = $request->input('per_page');
            // 取得件数が指定されていた場合はpaginationに引数としてわたしてあげる * 数字にキャストしないと返り値が文字列になってしまうので注意
            $news = $search_news->paginate((int)$per_page);
        } else {
            // 取得件数が未設定の場合はデフォルトの表示件数　１０件
            $news = $search_news->paginate(10);
        }

        // 各種フィルター用選択肢を取得
        $brands = Brand::select('id','brand_name')->get();
        $gender_categories = Category::select('id', 'category_name')->whereIn('id', [1,2])->get();
        $tags = Tag::select('id','tag_name')->get();

        // レスポンスを返却
        return response()->json([
            'news' => $news,
            'brands' => $brands,
            'gender_categories' => $gender_categories,
            'tags' => $tags,
        ],200);
    }

    public function create()
    {
        // 各種選択肢を取得
        $brands = Brand::select('id','brand_name')->get();
        $gender_categories = Category::select('id', 'category_name')->whereIn('id', [1,2])->get();
        $tags = Tag::select('id','tag_name')->get();
        
        // レスポンスを返却
        return response()->json([
            'brands' => $brands,
            'gender_categories' => $gender_categories,
            'tags' => $tags,
        ],200);
    }

    public function store(NewsRegisterRequest $request)
    {
        // 項目制限
        $data = $request->only($this->form_items);
        DB::beginTransaction();
        try {
            // 画像ファイルがあるかチェック
            if(!empty($data['file'])) {
                // ランダムなファイル名を生成してstorage/app/public/img配下に保存
                $path_as = Storage::putFile('public/img', $data['file']);
                // 画像を呼び出す場合は/storage/img/ファイル名で呼び出す必要があるのでDB保存用にpathを変更
                $db_reserve_path = str_replace('public/img/', '/storage/img/', $path_as);
            }
            // 基本情報をDBに保存
            $news = News::create([
                'title' => $data['title'],
                'body' => $data['body'],
                'brand_id' => $data['brand_id'],
                'category_id' => $data['category_id'],
                'thumbnail' => $db_reserve_path,
                'is_published' => $data['is_published'],
                'admin_id' => Auth::guard('admin')->id(),
                'posted_at' => $data['is_published'] == 1 ? Carbon::now(): null, // 公開日ベースで更新日を保存したいので条件分岐を追加
            ]);
            // タグ中間テーブルへの保存
            $news->tags()->sync(!empty($data['tags_id'])? $data['tags_id']: []);       
            DB::commit();
            return response()->json(['create' => true, 'message' => 'ニュースの新規登録を完了しました'], 200);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            DB::rollBack();
            return response()->json(['create' => false, 'message' => 'ニュースの新規登録を失敗しました'], 200);
        }
    }

    public function edit(News $news)
    {
        // 各種選択肢を取得
        $brands = Brand::select('id','brand_name')->get();
        $gender_categories = Category::select('id', 'category_name')->whereIn('id', [1,2])->get();
        $tags = Tag::select('id','tag_name')->get();

        $arr = [
            'title' => $news->title,
            'body' => $news->body,
            'brand_id' => $news->brand_id,
            'category_id' => $news->category_id,
            'thumbnail' => $news->thumbnail,
            'is_published' => $news->is_published,
            'tags_id' => $news->tags->pluck('id')->toArray() // 別テーブル
        ];
        
        // レスポンスを返却
        return response()->json([
            'news' => $arr,
            'brands' => $brands,
            'gender_categories' => $gender_categories,
            'tags' => $tags,
        ],200);
    }

    public function update(NewsEditRequest $request, News $news)
    {
        // 項目制限
        $data = $request->only($this->form_items);
        DB::beginTransaction();
        try {
            $db_reserve_path = null;
            // 画像ファイルがあるかチェック
            if(!empty($data['file'])) {
                // ランダムなファイル名を生成してstorage/app/public/img配下に保存
                $path_as = Storage::putFile('public/img', $data['file']);
                // 画像を呼び出す場合は/storage/img/ファイル名で呼び出す必要があるのでDB保存用にpathを変更
                $db_reserve_path = str_replace('public/img/', '/storage/img/', $path_as);
                // 変更時はニュースの古いサムネイル画像を削除する必要があるのでパスを取得して変換
                $old_img = str_replace('/storage/img/', 'public/img/', $news->thumbnail !== null ? $news->thumbnail : '');
                // fileの存在をチェックして削除
                if(Storage::exists($old_img)) Storage::delete($old_img);
            }
            // 初回登録時に非公開の状態で保存されている場合もあるのでカラム名の出し分け
            $registered_date = $news->posted_at !== null ? 'modified_at': 'posted_at';
            // 編集した内容を非公開で保存する場合は日付を更新したくないので該当インスタンスに登録されてる日付を取得
            $date = $registered_date === 'modified_at'? $news->modified_at : $news->posted_at;
            // 基本情報をDBに保存
            $news->fill([
                'title' => $data['title'],
                'body' => $data['body'],
                'brand_id' => $data['brand_id'],
                'category_id' => $data['category_id'],
                'thumbnail' => $db_reserve_path? $db_reserve_path: $data['thumbnail'],
                'is_published' => $data['is_published'],
                'admin_id' => Auth::guard('admin')->id(),
                $registered_date => $data['is_published'] == 1 ? Carbon::now(): $date, // 公開日ベースで更新日を保存したいので条件分岐を追加
            ])->save();
            // タグ中間テーブルへの保存
            $news->tags()->sync(!empty($data['tags_id'])? $data['tags_id']: []);
            DB::commit();
            return response()->json(['update' => true, 'message' => 'ニュースの編集を完了しました'], 200);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            DB::rollBack();
            return response()->json(['update' => false, 'message' => 'ニュースの編集を失敗しました'], 200);
        }
    }

    public function destroy(Request $request)
    {
        // 複数のIDが渡ってくるので全て取得する
        $id = $request->all();

        foreach($id as $item) {
            // インスタンスを生成して削除
            $news = News::find($item);
            $news->delete();
        }
        // レスポンスを返却
        return response()->json(['delete' => true, 'message' => 'ニュースの削除を完了しました'], 200);
    }

    public function csvExport(Request $request)
    {
        // 複数のIDが渡ってくるので全て取得する
        $id = $request->all();
        // 該当のIDのニュースを取得
        $news = News::whereIn('id', $id)->select(['news.id', 'title', 'thumbnail', 'is_published', 'posted_at', 'modified_at', 'brand_id', 'admin_id', 'category_id'])->with([
            'admin:id,first_name,last_name,first_name_kana,last_name_kana',
            'brand:id,brand_name',
            'tags:id,tag_name'
        ])->cursor();

        // クロージャの中でエラーが起きても、streamDownloadを呼んだ時点でもうヘッダーとかが返っているのでエラーレスポンスが返せない。
        return response()->streamDownload(function () use ($news) {
            // CSVのヘッダー作成
            $csv_header = ['No', '公開状況', 'タイトル', 'ブランド', 'カテゴリ', 'タグ', '最終更新者', '投稿日', '更新日'];
            // SplFileObjectのインスタンスを生成
            $file = new \SplFileObject('php://output', 'w');
            // EXCEL(デフォルトがShift-JIS形式)で開いた時に日本語が文字化けしないように、UTF-8のBOM付きにするためにBOMを書き込み
            $file->fwrite(pack('C*',0xEF,0xBB,0xBF));
            // ヘッダーの読み込み
            $file->fputcsv($csv_header);
            // 一行ずつ連想配列から値を取り出して配列に格納
            $num = 1;
            foreach ($news as $item){

                $file->fputcsv([
                    $num,
                    $item->is_published_text,
                    $item->title,
                    $item->brand->brand_name,
                    $item->gender_category_text,
                    implode(' / ', $item->tags->pluck('tag_name')->toArray()),
                    $item->admin->full_name.'('.$item->admin->full_name_kana.')',
                    $item->posted_at !== null ? $item->posted_at->format('Y-m-d'): '　　',
                    $item->modified_at !== null ? $item->modified_at->format('Y-m-d'): '　　',
                ]);
                $num++;
            }

        }, 'ニュース情報出力.csv', [
            'Content-Type' => 'text/csv'
        ]);
    }
}

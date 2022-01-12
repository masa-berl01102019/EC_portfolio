<?php

namespace App\Http\Controllers\Admin;

use Throwable;
use App\Models\Tag;
use App\Models\Blog;
use App\Models\Item;
use App\Models\Brand;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\admin\BlogEditRequest;
use App\Http\Requests\admin\BlogRegisterRequest;

class BlogController extends Controller
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
        $search_blog = Blog::select(['blogs.id', 'title', 'thumbnail', 'is_published', 'posted_at', 'modified_at', 'brand_id', 'admin_id', 'category_id'])->with([
            'admin:id,first_name,last_name,first_name_kana,last_name_kana',
            'brand:id,brand_name',
            'tags:id,tag_name',
            'items:id,product_number',
        ]);

        // フリーワード検索
        $search_blog->filterKeyword($request, ['title']);
        // 検索期間の指定フィルター
        $search_blog->filterDateRange($request);
        // 公開の有無フィルター
        $search_blog->filterIsPublished($request);
        // ブランドのフィルター
        $search_blog->filterBrand($request);
        // カテゴリのフィルター
        $search_blog->filterGenderCategory($request);
        // 関連商品のフィルター
        $search_blog->filterItem($request);
        // タグのフィルター
        $search_blog->filterTag($request);

        // 投稿日順->更新日順の優先順位でソートされる仕組み

        // 投稿日でソート
        $search_blog->orderByPostedAt($request);
        // 修正更新日でソート
        $search_blog->orderByModifiedAt($request);

        // 1ページ当たり件数の指定の有無を確認
        if($request->input('per_page')) {
            $per_page = $request->input('per_page');
            // 取得件数が指定されていた場合はpaginationに引数としてわたしてあげる * 数字にキャストしないと返り値が文字列になってしまうので注意
            $blogs = $search_blog->paginate((int)$per_page);
        } else {
            // 取得件数が未設定の場合はデフォルトの表示件数　１０件
            $blogs = $search_blog->paginate(10);
        }

        // 各種フィルター用選択肢を取得
        $brands = Brand::select('id','brand_name')->get();
        $gender_categories = Category::select('id', 'category_name')->whereIn('id', [1,2])->get();
        $items = Item::select('id','product_number')->orderBy('product_number')->get();
        $tags = Tag::select('id','tag_name')->get();

        // レスポンスを返却
        return response()->json([
            'blogs' => $blogs,
            'brands' => $brands,
            'gender_categories' => $gender_categories,
            'items' => $items,
            'tags' => $tags,
        ],200);
    }

    public function create()
    {
        // 各種選択肢を取得
        $brands = Brand::select('id','brand_name')->get();
        $gender_categories = Category::select('id', 'category_name')->whereIn('id', [1,2])->get();
        $items = Item::select('id','product_number')->orderBy('product_number')->get();
        $tags = Tag::select('id','tag_name')->get();
        
        // レスポンスを返却
        return response()->json([
            'brands' => $brands,
            'gender_categories' => $gender_categories,
            'items' => $items,
            'tags' => $tags,
        ],200);
    }

    public function store(BlogRegisterRequest $request)
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
            $blog = Blog::create([
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
            $blog->tags()->sync(!empty($data['tags_id'])? $data['tags_id']: []);
            // 商品中間テーブルへの保存
            $blog->items()->sync(!empty($data['items_id'])? $data['items_id']: []);         
            DB::commit();
            return response()->json(['create' => true, 'message' => 'ブログの新規登録を完了しました'], 200);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            DB::rollBack();
            return response()->json(['create' => false, 'message' => 'ブログの新規登録を失敗しました'], 200);
        }
    }

    public function edit(Blog $blog)
    {
        // 各種選択肢を取得
        $brands = Brand::select('id','brand_name')->get();
        $gender_categories = Category::select('id', 'category_name')->whereIn('id', [1,2])->get();
        $items = Item::select('id','product_number')->orderBy('product_number')->get();
        $tags = Tag::select('id','tag_name')->get();

        $arr = [
            'title' => $blog->title,
            'body' => $blog->body,
            'brand_id' => $blog->brand_id,
            'category_id' => $blog->category_id,
            'thumbnail' => $blog->thumbnail,
            'is_published' => $blog->is_published,
            'items_id' => $blog->items->pluck('id')->toArray(), // 別テーブル
            'tags_id' => $blog->tags->pluck('id')->toArray() // 別テーブル
        ];
        
        // レスポンスを返却
        return response()->json([
            'blog' => $arr,
            'brands' => $brands,
            'gender_categories' => $gender_categories,
            'items' => $items,
            'tags' => $tags,
        ],200);
    }

    public function update(BlogEditRequest $request, Blog $blog)
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
                // 変更時はブログの古いサムネイル画像を削除する必要があるのでパスを取得して変換
                $old_img = str_replace('/storage/img/', 'public/img/', $blog->thumbnail !== null ? $blog->thumbnail : '');
                // fileの存在をチェックして削除
                if(Storage::exists($old_img)) Storage::delete($old_img);
            }
            // 初回登録時に非公開の状態で保存されている場合もあるのでカラム名の出し分け
            $registered_date = $blog->posted_at !== null ? 'modified_at': 'posted_at';
            // 基本情報をDBに保存
            $blog->fill([
                'title' => $data['title'],
                'body' => $data['body'],
                'brand_id' => $data['brand_id'],
                'category_id' => $data['category_id'],
                'thumbnail' => $db_reserve_path? $db_reserve_path: $data['thumbnail'],
                'is_published' => $data['is_published'],
                'admin_id' => Auth::guard('admin')->id(),
                $registered_date => $data['is_published'] == 1 ? Carbon::now(): null, // 公開日ベースで更新日を保存したいので条件分岐を追加
            ])->save();
            // タグ中間テーブルへの保存
            $blog->tags()->sync(!empty($data['tags_id'])? $data['tags_id']: []);
            // 商品中間テーブルへの保存
            $blog->items()->sync(!empty($data['items_id'])? $data['items_id']: []);
            DB::commit();
            return response()->json(['update' => true, 'message' => 'ブログの編集を完了しました'], 200);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            DB::rollBack();
            return response()->json(['update' => false, 'message' => 'ブログの編集を失敗しました'], 200);
        }
    }

    public function destroy(Request $request)
    {
        // 複数のIDが渡ってくるので全て取得する
        $blogs = $request->all();

        foreach($blogs as $blog) {
            // インスタンスを生成して削除
            $blog = Blog::find($blog);
            $blog->delete();
        }
        // レスポンスを返却
        return response()->json(['delete' => true, 'message' => 'ブログの削除を完了しました'], 200);
    }

    public function csvExport(Request $request)
    {
        // 複数のIDが渡ってくるので全て取得する
        $id = $request->all();
        // 該当のIDのブログを取得
        $blogs = Blog::whereIn('id', $id)->select(['blogs.id', 'title', 'thumbnail', 'is_published', 'posted_at', 'modified_at', 'brand_id', 'admin_id', 'category_id'])->with([
            'admin:id,first_name,last_name,first_name_kana,last_name_kana',
            'brand:id,brand_name',
            'tags:id,tag_name',
            'items:id,product_number',
        ])->cursor();

        // クロージャの中でエラーが起きても、streamDownloadを呼んだ時点でもうヘッダーとかが返っているのでエラーレスポンスが返せない。
        return response()->streamDownload(function () use ($blogs) {
            // CSVのヘッダー作成
            $csv_header = ['No', '公開状況', 'タイトル', 'ブランド', 'カテゴリ', '関連品番', 'タグ', '最終更新者', '投稿日', '更新日'];
            // SplFileObjectのインスタンスを生成
            $file = new \SplFileObject('php://output', 'w');
            // EXCEL(デフォルトがShift-JIS形式)で開いた時に日本語が文字化けしないように、UTF-8のBOM付きにするためにBOMを書き込み
            $file->fwrite(pack('C*',0xEF,0xBB,0xBF));
            // ヘッダーの読み込み
            $file->fputcsv($csv_header);
            // 一行ずつ連想配列から値を取り出して配列に格納
            $num = 1;
            foreach ($blogs as $blog){

                $file->fputcsv([
                    $num,
                    $blog->is_published_text,
                    $blog->title,
                    $blog->brand->brand_name,
                    $blog->gender_category_text,
                    implode(' / ', $blog->items->pluck('product_number')->toArray()),
                    implode(' / ', $blog->tags->pluck('tag_name')->toArray()),
                    $blog->admin->full_name.'('.$blog->admin->full_name_kana.')',
                    $blog->posted_at !== null ? $blog->posted_at->format('Y-m-d'): '　　',
                    $blog->modified_at !== null ? $blog->modified_at->format('Y-m-d'): '　　',
                ]);
                $num++;
            }

        }, 'ブログ情報出力.csv', [
            'Content-Type' => 'text/csv'
        ]);
    }
}

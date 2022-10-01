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
use App\Http\Resources\TagResource;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Http\Resources\NewsResource;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\BrandResource;
use App\Http\Requests\admin\NewsEditRequest;
use App\Http\Requests\admin\NewsRegisterRequest;

class NewsController extends Controller
{
    // 該当のカラム以外を扱わないようにホワイトリスト作成
    private $form_items = [ 'title', 'body', 'brand_id', 'category_id', 'items_id', 'tags_id', 'is_published', 'file', 'thumbnail'];
    // 各種フィルター用プロパティ
    private $tags = null;
    private $brands = null;
    private $gender_categories = null;

    public function __construct()
    {
        // Auth認証
        $this->middleware('auth:admin');
        // 各種フィルター用選択肢を取得
        $this->tags = TagResource::collection(Tag::all());
        $this->brands = BrandResource::collection(Brand::all());
        $this->gender_categories = Category::genderCategories()->get();
    }

    public function index(Request $request)
    {
        $search_news = News::with(['admin', 'brand', 'tags']);

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

        // ページネーション
        $news = $search_news->customPaginate($request);
        
        // レスポンスを返却
        return (NewsResource::collection($news))->additional([
            // 各種選択肢をmeta情報としてトップレベルに追加
            'brands' => $this->brands,
            'gender_categories' => $this->gender_categories,
            'tags' => $this->tags
        ]);
    }

    public function create()
    {       
        // 各種選択肢を取得してレスポンスとして返却
        return response()->json([
            'brands' => $this->brands,
            'gender_categories' => $this->gender_categories,
            'tags' => $this->tags
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
                // 新しい画像の保存と古い画像の削除
                $db_reserve_path = saveImage($data['file']);                
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
        // レスポンスを返却
        return (new NewsResource($news))->additional([
            // 各種選択肢をmeta情報としてトップレベルに追加
            'brands' => $this->brands,
            'gender_categories' => $this->gender_categories,
            'tags' => $this->tags
        ]);
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
                // 新しい画像の保存と古い画像の削除
                $db_reserve_path = saveImage($data['file'], $news->thumbnail);
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
        $news = News::whereIn('id', $id)->with(['admin','brand','tags'])->cursor();
        // 配列の初期化
        $csv_body = [];
        // CSVに必要な項目を配列に格納
        $num = 1;
        foreach ($news as $item){
            $csv_body[] = [
                $num,
                $item->id,
                $item->is_published_text,
                $item->title,
                $item->brand->brand_name,
                $item->gender_category_text,
                implode(' / ', $item->tags->pluck('tag_name')->toArray()),
                optional($item->admin)->full_name.'('.optional($item->admin)->full_name_kana.')',
                $item->posted_at !== null ? $item->posted_at->format('Y/m/d H:i'): '　　',
                $item->modified_at !== null ? $item->modified_at->format('Y/m/d H:i'): '　　',
            ];
            $num++;
        }
        // headerの作成
        $csv_header = ['No', 'ID', '公開状況', 'タイトル', 'ブランド', 'カテゴリ', 'タグ', '最終更新者', '投稿日', '更新日'];
        // 独自helper関数呼び出し
        return csvExport($csv_body,$csv_header,'ニュース情報出力.csv');
    }
}

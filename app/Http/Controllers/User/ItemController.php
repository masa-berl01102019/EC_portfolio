<?php

namespace App\Http\Controllers\User;

use App\Models\Tag;
use App\Models\Item;
use App\Models\Size;
use App\Models\User;
use App\Models\Brand;
use App\Models\Color;
use App\Models\Category;
use Illuminate\Http\Request;
use App\Http\Resources\TagResource;
use App\Http\Controllers\Controller;
use App\Http\Resources\ItemResource;
use App\Http\Resources\SizeResource;
use App\Http\Resources\BrandResource;
use App\Http\Resources\ColorResource;
use Illuminate\Support\Facades\Cookie;
use App\Http\Resources\RelatedItemResource;
use Illuminate\Pagination\LengthAwarePaginator;

class ItemController extends Controller
{
    // 各種プロパティ
    private $cookie = null;
    private $recommend_flag = false;

    public function __construct()
    {
        // cookieを取得
        $this->cookie = json_decode(Cookie::get('item_info'));
    }

    public function index(Request $request)
    {
        $search_item = Item::getPublished()->with(['skus.color', 'skus.size', 'brand', 'genderCategory', 'mainCategory', 'subCategory', 'tags', 'admin']);

        // フリーワード検索
        $search_item->filterKeyword($request, ['item_name']);
        // ブランドのフィルター
        $search_item->filterBrand($request);
        // カラーのフィルター
        $search_item->filterColor($request);
        // サイズのフィルター
        $search_item->filterSize($request);
        // カテゴリのフィルター
        $search_item->filterCategory($request);
        // タグのフィルター
        $search_item->filterTag($request);
        // 検索期間の指定フィルター
        $search_item->filterDateRange($request);

        // 商品名順->価格順->原価順->投稿日順->修正更新日順の優先順位でソートされる仕組み

        // 商品名順でソート
        $search_item->orderByItemName($request);
        // 価格順でソート
        $search_item->orderByPrice($request);
        // 投稿日でソート
        $search_item->orderByPostedAt($request);
        // 修正更新日でソート
        $search_item->orderByModifiedAt($request);

        // ページネーション
        $items = $search_item->customPaginate($request);

        // レスポンスを返却
        return (ItemResource::collection($items))->additional([
            // 各種選択肢をmeta情報としてトップレベルに追加
            'brands' => BrandResource::collection(Brand::orderBy('brand_name', 'asc')->get()),
            'gender_categories' => Category::genderCategories()->get(),
            'main_categories' => Category::mainCategories()->get(),
            'sub_categories' => Category::subCategories()->get(),
            'sizes' => SizeResource::collection(Size::orderBy('size_name', 'desc')->get()),
            'colors' => ColorResource::collection(Color::orderBy('color_name', 'asc')->get()),
            'tags' => TagResource::collection(Tag::orderBy('tag_name', 'asc')->get())
        ]);
    }

    public function show($item)
    {
        $item = Item::where('id', $item)->getPublished()
            ->with(['skus', 'genderCategory', 'mainCategory', 'subCategory', 'tags', 'images', 'measurements', 'publishedBlogs'])
            ->first();

        // 関連商品の取得
        $related_items = Item::getRelatedItems($item->id);

        // レスポンスを返却
        return (new ItemResource($item))->additional([
            // 各種選択肢をmeta情報としてトップレベルに追加
            'sizes' => SizeResource::collection(Size::orderBy('size_name', 'desc')->get()),
            'related_items' => RelatedItemResource::collection($related_items)
        ]);
    }

    public function rank(Request $request)
    {
        // 商品ランキング
        $ranked_items = Item::itemRanking()->customPaginate($request);

        // レスポンスを返却
        return ItemResource::collection($ranked_items);
    }

    public function recommend(Request $request)
    {
        // TODO: ランキングは集計の期間を要検討 1週間?
        // TODO: おすすめを適用するのに十分なデータがない場合のおすすめのアルゴリズム実装必要

        // 購入履歴のあるユーザーの商品IDを取得
        $order_recodes = User::getUserOrderedItemId();
        // ユーザーの視聴履歴をcookieから取得
        $watched_item_arr = $this->cookie ? $this->cookie : [];

        // 購入商品がありもしくは視聴履歴がある場合
        if (!empty($order_recodes) && !empty($watched_item_arr)) {
            // 配列の初期化
            $similar_users = [];
            foreach ($order_recodes as $user_id_key => $order_arr) {
                // 視聴履歴と注文履歴の共通項を配列に格納して要素の数をカウント
                $count = count(array_intersect($watched_item_arr, $order_arr));
                // 視聴履歴と各ユーザーの購入履歴の共通項が1つ以上の物を配列に格納
                if ($count) $similar_users[$user_id_key] = $count;
            }
            // 類似度の高いユーザー順でIDでソート
            arsort($similar_users);
            // ソートしたユーザーのkey(ID)を配列に格納
            $similar_users = array_keys($similar_users);
            //配列を初期化
            $recommend_item_arr = [];
            // ソート順に商品IDを配列にマージしていく
            for ($i = 0; $i < count($similar_users); $i++) {
                $recommend_item_arr = array_merge($recommend_item_arr, $order_recodes[$similar_users[$i]]);
            }
            // 重複を排除
            $recommend_item_arr = array_unique($recommend_item_arr);
            // 配列を初期化
            $recommend_items = [];
            // ソート順に商品を取得
            foreach ($recommend_item_arr as $value) {
                $item = Item::where('id', $value)->getPublished()->with(['brand', 'genderCategory', 'topImage'])->filterCategory($request)->first();
                if (!empty($item)) {
                    $recommend_items[] = $item;
                }
            }
            // 配列をコレクションに変換
            $items = collect($recommend_items);
            // ページネーション
            $items = new LengthAwarePaginator(
                $items->forPage($request->page, 12), // 1ページ当たりの表示数
                count($items), // 総件数
                12, // 1ページ当たりの表示数
                $request->page, // 現在のページ番号
                array('path' => $request->url()) // ページの遷移先パス
            );
            // 4件以上取得出来れば表示
            $this->recommend_flag = count($items) > 3 ? true : false;
        }

        // レスポンスを返却
        return ItemResource::collection($this->recommend_flag ? $items : Item::getPublished()->with(['brand', 'genderCategory', 'topImage'])->filterCategory($request)->customPaginate($request));
    }

    public function option()
    {
        // レスポンスを返却
        return response()->json([
            'brands' => BrandResource::collection(Brand::orderBy('brand_name', 'asc')->get()),
            'gender_categories' => Category::genderCategories()->get(),
            'main_categories' => Category::mainCategories()->get(),
            'sub_categories' => Category::subCategories()->get(),
            'sizes' => SizeResource::collection(Size::orderBy('size_name', 'desc')->get()),
            'colors' => ColorResource::collection(Color::orderBy('color_name', 'asc')->get()),
            'tags' => TagResource::collection(Tag::orderBy('tag_name', 'asc')->get())
        ]);
    }
}

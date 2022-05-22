<?php

namespace App\Http\Controllers\User;

use App\Models\Tag;
use App\Models\Item;
use App\Models\Size;
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
use App\Http\Resources\RelatedItemResource;

class ItemController extends Controller
{
    // 各種フィルター用プロパティ
    private $sizes = null;
    private $colors = null;
    private $tags = null;
    private $brands = null;
    private $gender_categories = null;
    private $main_categories = null;
    private $sub_categories = null;

    public function __construct()
    {
        // 各種フィルター用選択肢を取得
        $this->sizes = SizeResource::collection(Size::orderBy('size_name', 'desc')->get());
        $this->colors = ColorResource::collection(Color::orderBy('color_name', 'asc')->get());
        $this->tags = TagResource::collection(Tag::all());
        $this->brands = BrandResource::collection(Brand::orderBy('brand_name', 'asc')->get());
        $this->gender_categories = Category::genderCategories()->get();
        $this->main_categories = Category::mainCategories()->get();
        $this->sub_categories = Category::subCategories()->get();
    }

    public function index(Request $request)
    {
        $search_item = Item::getPublished()->with([ 'skus.color', 'skus.size', 'brand', 'genderCategory', 'mainCategory', 'subCategory', 'tags', 'admin']);

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
            'brands' => $this->brands,
            'gender_categories' => $this->gender_categories,
            'main_categories' => $this->main_categories,
            'sub_categories' => $this->sub_categories,
            'sizes' => $this->sizes,
            'colors' => $this->colors,
            'tags' => $this->tags,
        ]);
    }

    public function show($item)
    {   
        $item = Item::where('id', $item)->getPublished()
            ->with(['skus', 'genderCategory', 'mainCategory', 'subCategory','tags','images','measurements', 'publishedBlogs'])
            ->first();
            
        // 関連商品の取得
        $related_items = Item::getRelatedItems($item->id);

        // レスポンスを返却
        return (new ItemResource($item))->additional([
            // 各種選択肢をmeta情報としてトップレベルに追加
            'sizes' => $this->sizes,
            'related_items' => RelatedItemResource::collection($related_items)
        ]);
    }
}

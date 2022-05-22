<?php

namespace App\Http\Controllers\User;

use App\Models\Tag;
use App\Models\Blog;
use App\Models\Item;
use App\Models\Brand;
use App\Models\Category;
use Illuminate\Http\Request;
use App\Http\Resources\TagResource;
use App\Http\Controllers\Controller;
use App\Http\Resources\BlogResource;
use App\Http\Resources\BrandResource;

class BlogController extends Controller
{
    public function index(Request $request)
    {
        $search_blog = Blog::getPublished()->with([ 'admin', 'brand', 'tags', 'items' ]);

        // フリーワード検索
        $search_blog->filterKeyword($request, ['title']);
        // 検索期間の指定フィルター
        $search_blog->filterDateRange($request);
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

        // ページネーション
        $blogs = $search_blog->customPaginate($request);

        // レスポンスを返却
        return (BlogResource::collection($blogs))->additional([
            // 各種選択肢をmeta情報としてトップレベルに追加
            'brands' => BrandResource::collection(Brand::all()),
            'gender_categories' => Category::genderCategories()->get(),
            'items' => Item::select('id','product_number')->orderBy('product_number')->get(),
            'tags' => TagResource::collection(Tag::all())
        ]);
    }

    public function show($blog)
    {
        $blog = Blog::getPublished()->where('id', $blog)->first();

        // レスポンスを返却
        return new BlogResource ($blog);
    }
}

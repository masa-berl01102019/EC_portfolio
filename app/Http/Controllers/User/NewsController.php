<?php

namespace App\Http\Controllers\User;

use App\Models\Tag;
use App\Models\News;
use App\Models\Brand;
use App\Models\Category;
use Illuminate\Http\Request;
use App\Http\Resources\TagResource;
use App\Http\Controllers\Controller;
use App\Http\Resources\NewsResource;
use App\Http\Resources\BrandResource;

class NewsController extends Controller
{
    public function index(Request $request)
    {
        $search_news = News::getPublished()->with(['admin', 'brand', 'tags']);

        // フリーワード検索
        $search_news->filterKeyword($request, ['title']);
        // 検索期間の指定フィルター
        $search_news->filterDateRange($request);
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
            'brands' => BrandResource::collection(Brand::all()),
            'gender_categories' => Category::genderCategories()->get(),
            'tags' => TagResource::collection(Tag::all())
        ]);
    }

    public function show($news)
    {
        $news = News::getPublished()->where('id', $news)->first();

        // レスポンスを返却
        return new NewsResource($news);
    }

}

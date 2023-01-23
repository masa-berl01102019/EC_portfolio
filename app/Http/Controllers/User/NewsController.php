<?php

namespace App\Http\Controllers\User;

use Throwable;
use App\Models\Tag;
use App\Models\News;
use App\Models\Brand;
use App\Models\Category;
use Illuminate\Http\Request;
use App\Http\Resources\TagResource;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Http\Resources\NewsResource;
use App\Http\Resources\BrandResource;

class NewsController extends Controller
{
    public function index(Request $request)
    {
        try {
            $search_news = News::getPublished()->with(['admin', 'brand', 'tags']);
            $search_news->filterKeyword($request, ['title']);
            $search_news->filterDateRange($request);
            $search_news->filterBrand($request);
            $search_news->filterGenderCategory($request);
            $search_news->filterTag($request);
            // posted_at > modified_at
            $search_news->orderByPostedAt($request);
            $search_news->orderByModifiedAt($request);
            $news = $search_news->customPaginate($request);
            return (NewsResource::collection($news))->additional([
                'brands' => BrandResource::collection(Brand::all()),
                'gender_categories' => Category::genderCategories()->get(),
                'tags' => TagResource::collection(Tag::all())
            ]);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            return response()->json(['status' => 9, 'message' => 'ニュースの取得に失敗しました'], 500);
        }
    }

    public function show($news)
    {
        try {
            $news = News::getPublished()->where('id', $news)->first();
            return new NewsResource($news);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            return response()->json(['status' => 9, 'message' => 'ニュースの取得に失敗しました'], 500);
        }
    }
}

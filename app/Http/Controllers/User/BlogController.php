<?php

namespace App\Http\Controllers\User;

use Throwable;
use App\Models\Tag;
use App\Models\Blog;
use App\Models\Item;
use App\Models\Brand;
use App\Models\Category;
use Illuminate\Http\Request;
use App\Http\Resources\TagResource;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Http\Resources\BlogResource;
use App\Http\Resources\BrandResource;

class BlogController extends Controller
{
    public function index(Request $request)
    {
        try {
            $search_blog = Blog::getPublished()->with(['admin', 'brand', 'tags', 'items']);
            $search_blog->filterKeyword($request, ['title']);
            $search_blog->filterDateRange($request);
            $search_blog->filterBrand($request);
            $search_blog->filterGenderCategory($request);
            $search_blog->filterItem($request);
            $search_blog->filterTag($request);
            // posted_at > modified_at
            $search_blog->orderByPostedAt($request);
            $search_blog->orderByModifiedAt($request);
            $blogs = $search_blog->customPaginate($request);
            return (BlogResource::collection($blogs))->additional([
                'brands' => BrandResource::collection(Brand::all()),
                'gender_categories' => Category::genderCategories()->get(),
                'items' => Item::getPublished()->select('id', 'product_number')->orderBy('product_number')->get(),
                'tags' => TagResource::collection(Tag::all())
            ]);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            return response()->json(['status' => 9, 'message' => trans('api.user.blogs.get_err')], 500);
        }
    }

    public function show($blog)
    {
        try {
            $blog = Blog::getPublished()->where('id', $blog)->first();
            return new BlogResource($blog);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            return response()->json(['status' => 9, 'message' => trans('api.user.blogs.get_err')], 500);
        }
    }
}

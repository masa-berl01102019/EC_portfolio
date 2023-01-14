<?php

namespace App\Http\Controllers\User;

use Throwable;
use App\Models\Tag;
use App\Models\Item;
use App\Models\Size;
use App\Models\User;
use App\Models\Brand;
use App\Models\Color;
use App\Models\Category;
use Illuminate\Http\Request;
use App\Http\Resources\TagResource;
use Illuminate\Support\Facades\Log;
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
    private $cookie = null;
    private $recommend_flag = false;

    public function __construct()
    {
        $this->cookie = json_decode(Cookie::get('item_info'));
    }

    public function index(Request $request)
    {
        try {
            $search_item = Item::getPublished()->with(['skus.color', 'skus.size', 'brand', 'genderCategory', 'mainCategory', 'subCategory', 'tags', 'admin']);
            $search_item->filterKeyword($request, ['item_name', 'product_number']);
            $search_item->filterBrand($request);
            $search_item->filterColor($request);
            $search_item->filterSize($request);
            $search_item->filterCategory($request);
            $search_item->filterTag($request);
            $search_item->filterPriceFrom($request);
            $search_item->filterPriceTo($request);
            $search_item->filterStock($request);
            $search_item->filterDateRange($request);
            // item_name > price > posted_at > modified_at
            $search_item->orderByItemName($request);
            $search_item->orderByPrice($request);
            $search_item->orderByPostedAt($request);
            $search_item->orderByModifiedAt($request);
            $items = $search_item->customPaginate($request);
            return (ItemResource::collection($items))->additional([
                'brands' => BrandResource::collection(Brand::orderBy('brand_name', 'asc')->get()),
                'gender_categories' => Category::genderCategories()->get(),
                'main_categories' => Category::mainCategories()->get(),
                'sub_categories' => Category::subCategories()->get(),
                'sizes' => SizeResource::collection(Size::orderBy('size_name', 'desc')->get()),
                'colors' => ColorResource::collection(Color::orderBy('color_name', 'asc')->get()),
                'tags' => TagResource::collection(Tag::orderBy('tag_name', 'asc')->get())
            ]);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            return response()->json(['status' => 9, 'message' => trans('api.user.items.get_err')], 500);
        }
    }

    public function show($item)
    {
        try {
            $item = Item::where('id', $item)->getPublished()
                ->with(['skus', 'genderCategory', 'mainCategory', 'subCategory', 'tags', 'images', 'measurements', 'publishedBlogs'])
                ->first();
            if (empty($item)) {
                return response()->json(['status' => 9, 'message' => trans('api.user.items.get_err2')], 400);
            }
            $related_items = Item::getRelatedItems($item->id);
            return (new ItemResource($item))->additional([
                'sizes' => SizeResource::collection(Size::orderBy('size_name', 'desc')->get()),
                'related_items' => RelatedItemResource::collection($related_items),
                'related_tags' => TagResource::collection($item->tags)
            ]);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            return response()->json(['status' => 9, 'message' => trans('api.user.items.get_err')], 500);
        }
    }

    public function rank(Request $request)
    {
        try {
            $ranked_items = Item::itemRanking()->customPaginate($request);
            return ItemResource::collection($ranked_items);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            return response()->json(['status' => 9, 'message' => trans('api.user.items.get_err3')], 500);
        }
    }

    public function recommend(Request $request)
    {
        try {
            // get Item ID users ordered
            $order_recodes = User::getUserOrderedItemId();
            // get item which user watched from cookie
            $watched_item_arr = $this->cookie ? $this->cookie : [];
            // recommend logic which find users with high similarity and display item which they bought 
            if (!empty($order_recodes) && !empty($watched_item_arr)) {
                $items = Item::getRecommendItems($order_recodes, $watched_item_arr, $request);
                // display if there are items more than 4
                $this->recommend_flag = count($items) > 3 ? true : false;
                // pagination
                $items = new LengthAwarePaginator(
                    $items->forPage($request->page, 12), // display result per page
                    count($items), // total result
                    12, // display result per page
                    $request->page, // current page
                    array('path' => $request->url()) // page link
                );
            }
            return $this->recommend_flag ? ItemResource::collection($items) : ItemResource::collection(
                Item::getPublished()->with(['brand', 'genderCategory', 'topImage'])->filterCategory($request)->customPaginate($request)
            );
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            return response()->json(['status' => 9, 'message' => trans('api.user.items.get_err4')], 500);
        }
    }

    public function new(Request $request)
    {
        try {
            $new_items = Item::itemNew()->customPaginate($request);
            return ItemResource::collection($new_items);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            return response()->json(['status' => 9, 'message' => trans('api.user.items.get_err5')], 500);
        }
    }

    public function option()
    {
        try {
            return response()->json([
                'brands' => BrandResource::collection(Brand::orderBy('brand_name', 'asc')->get()),
                'gender_categories' => Category::genderCategories()->get(),
                'main_categories' => Category::mainCategories()->get(),
                'sub_categories' => Category::subCategories()->get(),
                'sizes' => SizeResource::collection(Size::orderBy('size_name', 'desc')->get()),
                'colors' => ColorResource::collection(Color::orderBy('color_name', 'asc')->get()),
                'tags' => TagResource::collection(Tag::orderBy('tag_name', 'asc')->get())
            ]);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            return response()->json(['status' => 9, 'message' => trans('api.user.items.get_err6')], 500);
        }
    }
}

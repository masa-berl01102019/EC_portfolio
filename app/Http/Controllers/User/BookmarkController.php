<?php

namespace App\Http\Controllers\User;

use Throwable;
use App\Models\Size;
use App\Models\Brand;
use App\Models\Color;
use App\Models\Bookmark;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Http\Resources\SizeResource;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\BrandResource;
use App\Http\Resources\ColorResource;
use App\Http\Resources\BookmarkResource;
use App\Http\Requests\user\BookmarkRequest;

class BookmarkController extends Controller
{
    private $form_items = ['sku_id'];

    public function __construct()
    {
        $this->middleware('auth:user');
    }

    public function index(Request $request)
    {
        try {
            $search_bookmark = Bookmark::query();
            $search_bookmark = $search_bookmark->where('user_id', Auth::guard('user')->user()->id)
                ->join('skus', 'bookmarks.sku_id', '=', 'skus.id')
                ->join('items', function ($join) {
                    $join->on('items.id', '=', 'skus.item_id')->where('is_published', config('define.is_published.open'))->where('items.deleted_at', null);
                })
                ->join('brands', 'items.brand_id', '=', 'brands.id')
                ->select('bookmarks.id', 'bookmarks.updated_at', 'bookmarks.sku_id', 'skus.item_id', 'skus.size_id', 'skus.color_id', 'items.item_name', 'items.price', 'items.brand_id', 'brands.brand_name');
            // I need pass foreign key at select func when I use join func so that I can call model which has relation at API Resources 
            // I can use Accessor (ex $this->price_text) at API Resources as long as I pass price at select func
            $search_bookmark->filterKeyword($request, ['item_name']);
            $search_bookmark->filterBrand($request, 'sku.item', 'brand_id');
            $search_bookmark->filterColor($request, 'sku', 'color_id');
            $search_bookmark->filterSize($request, 'sku', 'size_id');
            // item_name > price > updated_at
            $search_bookmark->orderByItemName($request);
            $search_bookmark->orderByPrice($request);
            $search_bookmark->orderByUpdatedAt($request);
            $bookmarks = $search_bookmark->customPaginate($request);
            return (BookmarkResource::collection($bookmarks))->additional([
                'brands' => BrandResource::collection(Brand::orderBy('brand_name', 'asc')->get()),
                'sizes' => SizeResource::collection(Size::orderBy('size_name', 'desc')->get()),
                'colors' => ColorResource::collection(Color::orderBy('color_name', 'asc')->get()),
            ]);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            return response()->json(['status' => config('define.api_status.error'), 'message' => trans('api.user.bookmarks.get_err')], 500);
        }
    }

    public function store(BookmarkRequest $request)
    {
        DB::beginTransaction();
        try {
            $data = $request->only($this->form_items);
            Bookmark::create([
                'user_id' => Auth::guard('user')->user()->id,
                'sku_id' => $data['sku_id']
            ]);
            DB::commit();
            return response()->json(['status' => config('define.api_status.success'), 'message' => trans('api.user.bookmarks.create_msg')], 200);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            DB::rollBack();
            return response()->json(['status' => config('define.api_status.error'), 'message' => trans('api.user.bookmarks.create_err')], 500);
        }
    }

    public function destroy(Bookmark $bookmark)
    {
        DB::beginTransaction();
        try {
            $bookmark->delete();
            DB::commit();
            return response()->json(['status' => config('define.api_status.success'), 'message' => trans('api.user.bookmarks.delete_msg')], 200);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            DB::rollBack();
            return response()->json(['status' => config('define.api_status.error'), 'message' => trans('api.user.bookmarks.delete_err')], 500);
        }
    }
}

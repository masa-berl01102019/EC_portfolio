<?php

namespace App\Http\Controllers\Admin;

use Throwable;
use App\Models\Sku;
use App\Models\Tag;
use App\Models\Item;
use App\Models\Size;
use App\Models\Brand;
use App\Models\Color;
use App\Models\Image;
use App\Models\Category;
use App\Models\Measurement;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use App\Http\Resources\TagResource;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Http\Resources\ItemResource;
use App\Http\Resources\SizeResource;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\BrandResource;
use App\Http\Resources\ColorResource;
use App\Http\Requests\admin\ItemEditRequest;
use App\Http\Requests\admin\ItemRegisterRequest;

class ItemController extends Controller
{
    private $form_items = ['product_number', 'item_name', 'price', 'cost', 'made_in', 'mixture_ratio', 'description', 'is_published', 'brand_id', 'gender_category', 'main_category', 'sub_category', 'tags_id', 'skus', 'images', 'measurements'];

    public function __construct()
    {
        $this->middleware('auth:admin');
    }

    public function index(Request $request)
    {
        try {
            $search_item = Item::with(['skus.color', 'skus.size', 'brand', 'genderCategory', 'mainCategory', 'subCategory', 'tags', 'admin']);
            $search_item->filterKeyword($request, ['item_name', 'product_number']);
            $search_item->filterIsPublished($request);
            $search_item->filterBrand($request);
            $search_item->filterColor($request);
            $search_item->filterSize($request);
            $search_item->filterCategory($request);
            $search_item->filterTag($request);
            $search_item->filterPriceFrom($request, 'exclude');
            $search_item->filterPriceTo($request, 'exclude');
            $search_item->filterStock($request);
            $search_item->filterDateFrom($request);
            $search_item->filterDateTo($request);
            // product_number > item_name > price > cost > posted_at > modified_at
            $search_item->orderByProductNumber($request);
            $search_item->orderByItemName($request);
            $search_item->orderByPrice($request);
            $search_item->orderByCost($request);
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
                'tags' => TagResource::collection(Tag::all()),
            ]);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            return response()->json(['status' => config('define.api_status.error'), 'message' => trans('api.admin.items.get_err')], 500);
        }
    }

    public function create()
    {
        try {
            return response()->json([
                'brands' => BrandResource::collection(Brand::orderBy('brand_name', 'asc')->get()),
                'gender_categories' => Category::genderCategories()->get(),
                'main_categories' => Category::mainCategories()->get(),
                'sub_categories' => Category::subCategories()->get(),
                'sizes' => SizeResource::collection(Size::orderBy('size_name', 'desc')->get()),
                'colors' => ColorResource::collection(Color::orderBy('color_name', 'asc')->get()),
                'tags' => TagResource::collection(Tag::all())
            ]);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            return response()->json(['status' => config('define.api_status.error'), 'message' => trans('api.admin.items.get_err')], 500);
        }
    }

    public function store(ItemRegisterRequest $request)
    {
        DB::beginTransaction();
        try {
            $data = $request->only($this->form_items);
            $item = Item::create([
                'product_number' => $data['product_number'],
                'item_name' => $data['item_name'],
                'price' => $data['price'],
                'cost' => $data['cost'],
                'made_in' => $data['made_in'],
                'mixture_ratio' => $data['mixture_ratio'],
                'description' => $data['description'],
                'is_published' => $data['is_published'],
                'admin_id' => Auth::guard('admin')->id(),
                'brand_id' => $data['brand_id'],
                'posted_at' => $data['is_published'] == config('define.is_published.open') ? Carbon::now() : null
            ]);
            // category ID stored in DB are deleted if it doesn't match category id in Array
            $item->categories()->sync([$data['gender_category'], $data['main_category'], $data['sub_category']]);
            $item->tags()->sync(!empty($data['tags_id']) ? $data['tags_id'] : []);
            // skus can be multiple
            for ($i = 0; $i < count($data['skus']); $i++) {
                Sku::create([
                    'item_id' => $item->id,
                    'size_id' => $data['skus'][$i]['size_id'],
                    'color_id' => $data['skus'][$i]['color_id'],
                    'quantity' => $data['skus'][$i]['quantity'],
                ]);
            }
            // images can be multiple
            for ($i = 0; $i < count($data['images']); $i++) {
                // checking whether there is a image file
                if (!empty($data['images'][$i]['file'])) {
                    $db_reserve_path = saveImage($data['images'][$i]['file']);
                }
                Image::create([
                    'item_id' => $item->id,
                    'color_id' => $data['images'][$i]['color_id'],
                    'image' => $db_reserve_path,
                    'image_category' => $data['images'][$i]['image_category'],
                ]);
            }
            // measurements can be multiple
            for ($i = 0; $i < count($data['measurements']); $i++) {
                Measurement::create([
                    'item_id' => $item->id,
                    'size_id' => $data['measurements'][$i]['size_id'],
                    'width' => $data['measurements'][$i]['width'],
                    'shoulder_width' => $data['measurements'][$i]['shoulder_width'],
                    'raglan_sleeve_length' => $data['measurements'][$i]['raglan_sleeve_length'],
                    'sleeve_length' => $data['measurements'][$i]['sleeve_length'],
                    'length' => $data['measurements'][$i]['length'],
                    'waist' => $data['measurements'][$i]['waist'],
                    'hip' => $data['measurements'][$i]['hip'],
                    'rise' => $data['measurements'][$i]['rise'],
                    'inseam' => $data['measurements'][$i]['inseam'],
                    'thigh_width' => $data['measurements'][$i]['thigh_width'],
                    'outseam' => $data['measurements'][$i]['outseam'],
                    'sk_length' => $data['measurements'][$i]['sk_length'],
                    'hem_width' => $data['measurements'][$i]['hem_width'],
                    'weight' => $data['measurements'][$i]['weight']
                ]);
            }
            DB::commit();
            return response()->json(['status' => config('define.api_status.success'), 'message' => trans('api.admin.items.create_msg')], 200);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            DB::rollBack();
            return response()->json(['status' => config('define.api_status.error'), 'message' => trans('api.admin.items.create_err')], 500);
        }
    }

    public function edit($item)
    {
        try {
            $item = Item::where('id', $item)->with(['skus', 'genderCategory', 'mainCategory', 'subCategory', 'tags', 'images', 'measurements'])->first();
            return (new ItemResource($item))->additional([
                'brands' => BrandResource::collection(Brand::orderBy('brand_name', 'asc')->get()),
                'gender_categories' => Category::genderCategories()->get(),
                'main_categories' => Category::mainCategories()->get(),
                'sub_categories' => Category::subCategories()->get(),
                'sizes' => SizeResource::collection(Size::orderBy('size_name', 'desc')->get()),
                'colors' => ColorResource::collection(Color::orderBy('color_name', 'asc')->get()),
                'tags' => TagResource::collection(Tag::all()),
            ]);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            return response()->json(['status' => config('define.api_status.error'), 'message' => trans('api.admin.items.get_err')], 500);
        }
    }

    public function update(ItemEditRequest $request, Item $item)
    {
        DB::beginTransaction();
        try {
            $data = $request->only($this->form_items);
            // which column should be register depends on whether the record wasn't published once yet
            $registered_date = $item->posted_at !== null ? 'modified_at' : 'posted_at';
            $date = $registered_date === 'modified_at' ? $item->modified_at : $item->posted_at;
            $item->fill([
                'product_number' => $data['product_number'],
                'item_name' => $data['item_name'],
                'price' => $data['price'],
                'cost' => $data['cost'],
                'made_in' => $data['made_in'],
                'mixture_ratio' => $data['mixture_ratio'],
                'description' => $data['description'],
                'is_published' => $data['is_published'],
                'admin_id' => Auth::guard('admin')->id(),
                'brand_id' => $data['brand_id'],
                $registered_date => $data['is_published'] == config('define.is_published.open') ? Carbon::now() : $date // don't update published date if is_published status close
            ])->save();
            // category ID stored in DB are deleted if it doesn't match category id in Array
            $item->categories()->sync([$data['gender_category'], $data['main_category'], $data['sub_category']]);
            $item->tags()->sync(!empty($data['tags_id']) ? $data['tags_id'] : []);
            // skus can be multiple
            for ($i = 0; $i < count($data['skus']); $i++) {
                // create a new record if ID is null, update a record if it match ID in DB
                Sku::updateOrCreate([
                    'id' => $data['skus'][$i]['id']
                ], $data['skus'][$i]);
            }
            // images can be multiple
            for ($i = 0; $i < count($data['images']); $i++) {
                // checking whether there is a image file
                if (!empty($data['images'][$i]['file'])) {
                    $img = Image::find($data['images'][$i]['id']);
                    $db_reserve_path = saveImage($data['images'][$i]['file'], !empty($img) ? $img->image : null);
                    // change image path because BLOB url is stored in $data['images'][$i]['image']
                    $data['images'][$i]['image'] = $db_reserve_path;
                }
                // create a new record if ID is null, update a record if it match ID in DB
                Image::updateOrCreate([
                    'id' => $data['images'][$i]['id']
                ], $data['images'][$i]);
            }
            // measurements can be multiple
            for ($i = 0; $i < count($data['measurements']); $i++) {
                // create a new record if ID is null, update a record if it match ID in DB
                Measurement::updateOrCreate([
                    'id' => $data['measurements'][$i]['id']
                ], $data['measurements'][$i]);
            }
            DB::commit();
            return response()->json(['status' => config('define.api_status.success'), 'message' => trans('api.admin.items.update_msg')], 200);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            DB::rollBack();
            return response()->json(['status' => config('define.api_status.error'), 'message' => trans('api.admin.items.update_err')], 500);
        }
    }

    public function destroy(Request $request)
    {
        DB::beginTransaction();
        try {
            $items = $request->all();
            foreach ($items as $item) {
                $item = Item::find($item);
                $item->delete();
            }
            DB::commit();
            return response()->json(['status' => config('define.api_status.success'), 'message' => trans('api.admin.items.delete_msg')], 200);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            DB::rollBack();
            return response()->json(['status' => config('define.api_status.error'), 'message' => trans('api.admin.items.delete_err')], 500);
        }
    }

    public function destroyMeasurement(Measurement $measurement)
    {
        DB::beginTransaction();
        try {
            $measurement->delete();
            DB::commit();
            return response()->json(['status' => config('define.api_status.success'), 'message' => trans('api.admin.items.delete_size_msg')], 200);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            DB::rollBack();
            return response()->json(['status' => config('define.api_status.error'), 'message' => trans('api.admin.items.delete_size_err')], 500);
        }
    }

    public function destroySku(Sku $sku)
    {
        DB::beginTransaction();
        try {
            $sku->delete();
            DB::commit();
            return response()->json(['status' => config('define.api_status.success'), 'message' => trans('api.admin.items.delete_sku_msg')], 200);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            DB::rollBack();
            return response()->json(['status' => config('define.api_status.error'), 'message' => trans('api.admin.items.delete_sku_err')], 500);
        }
    }

    public function destroyImage(Image $image)
    {
        DB::beginTransaction();
        try {
            $image->delete();
            DB::commit();
            return response()->json(['status' => config('define.api_status.success'), 'message' => trans('api.admin.items.delete_img_msg')], 200);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            DB::rollBack();
            return response()->json(['status' => config('define.api_status.error'), 'message' => trans('api.admin.items.delete_img_err')], 500);
        }
    }

    public function csvExport(Request $request)
    {
        try {
            $id = $request->all();
            $items = Item::whereIn('id', $id)->with(['skus.color', 'skus.size', 'brand', 'genderCategory', 'mainCategory', 'subCategory', 'tags', 'admin'])->cursor();
            $csv_body = [];
            $num = 1;
            foreach ($items as $item) {
                $csv_body[] = [
                    $num,
                    $item->id,
                    $item->is_published_text,
                    $item->product_number,
                    $item->item_name,
                    $item->price_text,
                    $item->cost_text,
                    implode(' / ', Color::whereIn('id', array_unique($item->skus->pluck('color_id')->toArray()))->pluck('color_name')->toArray()),
                    implode(' / ', Size::whereIn('id', array_unique($item->skus->pluck('size_id')->toArray()))->pluck('size_name')->toArray()),
                    $item->made_in,
                    $item->mixture_ratio,
                    $item->brand->brand_name,
                    $item->genderCategory ? $item->genderCategory->first()->category_name : '',
                    $item->mainCategory ? $item->mainCategory->first()->category_name : '',
                    $item->subCategory ? $item->subCategory->first()->category_name : '',
                    implode(' / ', $item->tags->pluck('tag_name')->toArray()),
                    optional($item->admin)->full_name . '(' . optional($item->admin)->full_name_kana . ')',
                    $item->posted_at !== null ? $item->posted_at->format('Y/m/d H:i') : '　　',
                    $item->modified_at !== null ? $item->modified_at->format('Y/m/d H:i') : '　　',
                ];
                $num++;
            }
            $csv_header = trans('api.admin.items.csv_header');
            return csvExport($csv_body, $csv_header, trans('api.admin.items.csv_file_name'));
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            return response()->json(['status' => config('define.api_status.error'), 'message' => trans('api.admin.items.csv_err')], 500);
        }
    }
}

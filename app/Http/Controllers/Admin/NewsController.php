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
    private $form_items = ['title', 'body', 'brand_id', 'category_id', 'items_id', 'tags_id', 'is_published', 'file', 'thumbnail'];

    public function __construct()
    {
        $this->middleware('auth:admin');
    }

    public function index(Request $request)
    {
        try {
            $search_news = News::with(['admin', 'brand', 'tags']);
            $search_news->filterKeyword($request, ['title']);
            $search_news->filterDateRange($request);
            $search_news->filterIsPublished($request);
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
            return response()->json(['status' => config('define.api_status.error'), 'message' => trans('api.admin.news.get_err')], 500);
        }
    }

    public function create()
    {
        try {
            return response()->json([
                'brands' => BrandResource::collection(Brand::all()),
                'gender_categories' => Category::genderCategories()->get(),
                'tags' => TagResource::collection(Tag::all())
            ]);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            return response()->json(['status' => config('define.api_status.error'), 'message' => trans('api.admin.news.get_err')], 500);
        }
    }

    public function store(NewsRegisterRequest $request)
    {
        DB::beginTransaction();
        try {
            $data = $request->only($this->form_items);
            // checking whether there is a image file
            if (!empty($data['file'])) {
                $db_reserve_path = saveImage($data['file']);
            }
            $news = News::create([
                'title' => $data['title'],
                'body' => $data['body'],
                'brand_id' => $data['brand_id'],
                'category_id' => $data['category_id'],
                'thumbnail' => $db_reserve_path,
                'is_published' => $data['is_published'],
                'admin_id' => Auth::guard('admin')->id(),
                'posted_at' => $data['is_published'] == config('define.is_published.open') ? Carbon::now() : null
            ]);
            $news->tags()->sync(!empty($data['tags_id']) ? $data['tags_id'] : []);
            DB::commit();
            return response()->json(['status' => config('define.api_status.success'), 'message' => trans('api.admin.news.create_msg')], 200);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            DB::rollBack();
            return response()->json(['status' => config('define.api_status.error'), 'message' => trans('api.admin.news.create_err')], 500);
        }
    }

    public function edit(News $news)
    {
        try {
            return (new NewsResource($news))->additional([
                'brands' => BrandResource::collection(Brand::all()),
                'gender_categories' => Category::genderCategories()->get(),
                'tags' => TagResource::collection(Tag::all())
            ]);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            return response()->json(['status' => config('define.api_status.error'), 'message' => trans('api.admin.news.get_err')], 500);
        }
    }

    public function update(NewsEditRequest $request, News $news)
    {
        DB::beginTransaction();
        try {
            $data = $request->only($this->form_items);
            $db_reserve_path = null;
            // checking whether there is a image file
            if (!empty($data['file'])) {
                $db_reserve_path = saveImage($data['file'], $news->thumbnail);
            }
            // which column should be register depends on whether the record wasn't published once yet
            $registered_date = $news->posted_at !== null ? 'modified_at' : 'posted_at';
            $date = $registered_date === 'modified_at' ? $news->modified_at : $news->posted_at;
            $news->fill([
                'title' => $data['title'],
                'body' => $data['body'],
                'brand_id' => $data['brand_id'],
                'category_id' => $data['category_id'],
                'thumbnail' => $db_reserve_path ? $db_reserve_path : $data['thumbnail'],
                'is_published' => $data['is_published'],
                'admin_id' => Auth::guard('admin')->id(),
                $registered_date => $data['is_published'] == config('define.is_published.open') ? Carbon::now() : $date // don't update published date if is_published status close
            ])->save();
            $news->tags()->sync(!empty($data['tags_id']) ? $data['tags_id'] : []);
            DB::commit();
            return response()->json(['status' => config('define.api_status.success'), 'message' => trans('api.admin.news.update_msg')], 200);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            DB::rollBack();
            return response()->json(['status' => config('define.api_status.error'), 'message' => trans('api.admin.news.update_err')], 500);
        }
    }

    public function destroy(Request $request)
    {
        DB::beginTransaction();
        try {
            $id = $request->all();
            foreach ($id as $item) {
                $news = News::find($item);
                $news->delete();
            }
            DB::commit();
            return response()->json(['status' => config('define.api_status.success'), 'message' => trans('api.admin.news.delete_msg')], 200);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            DB::rollBack();
            return response()->json(['status' => config('define.api_status.error'), 'message' => trans('api.admin.news.delete_err')], 500);
        }
    }

    public function csvExport(Request $request)
    {
        try {
            $id = $request->all();
            $news = News::whereIn('id', $id)->with(['admin', 'brand', 'tags'])->cursor();
            $csv_body = [];
            $num = 1;
            foreach ($news as $item) {
                $csv_body[] = [
                    $num,
                    $item->id,
                    $item->is_published_text,
                    $item->title,
                    $item->brand->brand_name,
                    $item->gender_category_text,
                    implode(' / ', $item->tags->pluck('tag_name')->toArray()),
                    optional($item->admin)->full_name . '(' . optional($item->admin)->full_name_kana . ')',
                    $item->posted_at !== null ? $item->posted_at->format('Y/m/d H:i') : '　　',
                    $item->modified_at !== null ? $item->modified_at->format('Y/m/d H:i') : '　　',
                ];
                $num++;
            }
            $csv_header = trans('api.admin.news.csv_header');
            return csvExport($csv_body, $csv_header, trans('api.admin.news.csv_file_name'));
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            return response()->json(['status' => config('define.api_status.error'), 'message' => trans('api.admin.news.csv_err')], 500);
        }
    }
}

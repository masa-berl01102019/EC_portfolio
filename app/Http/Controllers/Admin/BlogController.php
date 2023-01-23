<?php

namespace App\Http\Controllers\Admin;

use Throwable;
use App\Models\Tag;
use App\Models\Blog;
use App\Models\Item;
use App\Models\Brand;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use App\Http\Resources\TagResource;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Http\Resources\BlogResource;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\BrandResource;
use App\Http\Requests\admin\BlogEditRequest;
use App\Http\Requests\admin\BlogRegisterRequest;

class BlogController extends Controller
{
    private $form_items = ['title', 'body', 'brand_id', 'category_id', 'items_id', 'tags_id', 'is_published', 'file', 'thumbnail'];

    public function __construct()
    {
        $this->middleware('auth:admin');
    }

    public function index(Request $request)
    {
        try {
            $search_blog = Blog::with(['admin', 'brand', 'tags', 'items']);
            $search_blog->filterKeyword($request, ['title']);
            $search_blog->filterDateRange($request);
            $search_blog->filterIsPublished($request);
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
                'items' => Item::select('id', 'product_number')->orderBy('product_number')->get(),
                'tags' => TagResource::collection(Tag::all())
            ]);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            return response()->json(['status' => 9, 'message' => trans('api.admin.blogs.get_err')], 500);
        }
    }

    public function create()
    {
        try {
            return response()->json([
                'brands' => BrandResource::collection(Brand::all()),
                'gender_categories' => Category::genderCategories()->get(),
                'items' => Item::select('id', 'product_number')->orderBy('product_number')->get(),
                'tags' => TagResource::collection(Tag::all())
            ]);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            return response()->json(['status' => 9, 'message' => trans('api.admin.blogs.get_err')], 500);
        }
    }

    public function store(BlogRegisterRequest $request)
    {
        DB::beginTransaction();
        try {
            $data = $request->only($this->form_items);
            // checking whether there is a image file
            if (!empty($data['file'])) {
                $db_reserve_path = saveImage($data['file']);
            }
            $blog = Blog::create([
                'title' => $data['title'],
                'body' => $data['body'],
                'brand_id' => $data['brand_id'],
                'category_id' => $data['category_id'],
                'thumbnail' => $db_reserve_path,
                'is_published' => $data['is_published'],
                'admin_id' => Auth::guard('admin')->id(),
                'posted_at' => $data['is_published'] == config('define.is_published.open') ? Carbon::now() : null
            ]);
            $blog->tags()->sync(!empty($data['tags_id']) ? $data['tags_id'] : []);
            $blog->items()->sync(!empty($data['items_id']) ? $data['items_id'] : []);
            DB::commit();
            return response()->json(['status' => 1, 'message' => trans('api.admin.blogs.create_msg')], 200);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            DB::rollBack();
            return response()->json(['status' => 9, 'message' => trans('api.admin.blogs.create_err')], 500);
        }
    }

    public function edit(Blog $blog)
    {
        try {
            return (new BlogResource($blog))->additional([
                'brands' => BrandResource::collection(Brand::all()),
                'gender_categories' => Category::genderCategories()->get(),
                'items' => Item::select('id', 'product_number')->orderBy('product_number')->get(),
                'tags' => TagResource::collection(Tag::all())
            ]);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            return response()->json(['status' => 9, 'message' => trans('api.admin.blogs.get_err')], 500);
        }
    }

    public function update(BlogEditRequest $request, Blog $blog)
    {
        DB::beginTransaction();
        try {
            $data = $request->only($this->form_items);
            $db_reserve_path = null;
            // checking whether there is a image file
            if (!empty($data['file'])) {
                $db_reserve_path = saveImage($data['file'], $blog->thumbnail);
            }
            // which column should be register depends on whether the record wasn't published once yet
            $registered_date = $blog->posted_at !== null ? 'modified_at' : 'posted_at';
            $date = $registered_date === 'modified_at' ? $blog->modified_at : $blog->posted_at;
            $blog->fill([
                'title' => $data['title'],
                'body' => $data['body'],
                'brand_id' => $data['brand_id'],
                'category_id' => $data['category_id'],
                'thumbnail' => $db_reserve_path ? $db_reserve_path : $data['thumbnail'],
                'is_published' => $data['is_published'],
                'admin_id' => Auth::guard('admin')->id(),
                $registered_date => $data['is_published'] == 1 ? Carbon::now() : $date // don't update published date if is_published status close
            ])->save();
            $blog->tags()->sync(!empty($data['tags_id']) ? $data['tags_id'] : []);
            $blog->items()->sync(!empty($data['items_id']) ? $data['items_id'] : []);
            DB::commit();
            return response()->json(['status' => 1, 'message' => trans('api.admin.blogs.update_msg')], 200);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            DB::rollBack();
            return response()->json(['status' => 9, 'message' => trans('api.admin.blogs.update_err')], 500);
        }
    }

    public function destroy(Request $request)
    {
        DB::beginTransaction();
        try {
            $blogs = $request->all();
            foreach ($blogs as $blog) {
                $blog = Blog::find($blog);
                $blog->delete();
            }
            DB::commit();
            return response()->json(['status' => 1, 'message' => trans('api.admin.blogs.delete_msg')], 200);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            DB::rollBack();
            return response()->json(['status' => 9, 'message' => trans('api.admin.blogs.delete_err')], 500);
        }
    }

    public function csvExport(Request $request)
    {
        try {
            $id = $request->all();
            $blogs = Blog::whereIn('id', $id)->with(['admin', 'brand', 'tags', 'items',])->cursor();
            $csv_body = [];
            $num = 1;
            foreach ($blogs as $blog) {
                $csv_body[] = [
                    $num,
                    $blog->id,
                    $blog->is_published_text,
                    $blog->title,
                    $blog->brand->brand_name,
                    $blog->gender_category_text,
                    implode(' / ', $blog->items->pluck('product_number')->toArray()),
                    implode(' / ', $blog->tags->pluck('tag_name')->toArray()),
                    optional($blog->admin)->full_name . '(' . optional($blog->admin)->full_name_kana . ')',
                    $blog->posted_at !== null ? $blog->posted_at->format('Y/m/d H:i') : '　　',
                    $blog->modified_at !== null ? $blog->modified_at->format('Y/m/d H:i') : '　　',
                ];
                $num++;
            }
            $csv_header = trans('api.admin.blogs.csv_header');
            return csvExport($csv_body, $csv_header, trans('api.admin.blogs.csv_file_name'));
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            return response()->json(['status' => 9, 'message' => trans('api.admin.blogs.csv_err')], 500);
        }
    }
}

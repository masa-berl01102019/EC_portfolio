<?php

namespace App\Http\Controllers\Admin;

use Throwable;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Http\Requests\admin\CategoryEditRequest;
use App\Http\Requests\admin\CategoryRegisterRequest;

class CategoryController extends Controller
{
    private $form_items = ['id', 'category_name', 'parent_id'];

    public function __construct()
    {
        $this->middleware('auth:admin');
    }

    public function index(Request $request)
    {
        try {
            $categories = Category::whereIn('id', [1, 2])->select('id', 'category_name', 'parent_id')->with(['children:id,category_name,parent_id', 'children.grandChildren:id,category_name,parent_id'])->get()->toArray();
            return response()->json(['categories' => $categories]);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            return response()->json(['status' => 9, 'message' => trans('api.admin.categories.get_err')], 500);
        }
    }

    public function store(CategoryRegisterRequest $request)
    {
        DB::beginTransaction();
        try {
            $data = $request->only($this->form_items);
            Category::create([
                'category_name' => $data['category_name'],
                'parent_id' => $data['parent_id'],
            ]);
            DB::commit();
            return response()->json(['status' => 1, 'message' => trans('api.admin.categories.create_msg')], 200);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            DB::rollBack();
            return response()->json(['status' => 9, 'message' => trans('api.admin.categories.create_err')], 500);
        }
    }

    public function update(CategoryEditRequest $request, Category $category)
    {
        DB::beginTransaction();
        try {
            $data = $request->only($this->form_items);
            $category->fill($data)->save();
            DB::commit();
            return response()->json(['status' => 1, 'message' => trans('api.admin.categories.update_msg')], 200);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            DB::rollBack();
            return response()->json(['status' => 9, 'message' => trans('api.admin.categories.update_err')], 500);
        }
    }

    public function destroy(Category $category)
    {
        DB::beginTransaction();
        try {
            if (!$category->items->isEmpty() || !$category->news->isEmpty() || !$category->blogs->isEmpty()) {
                return response()->json(['status' => 9, 'message' => trans('api.admin.categories.delete_err2')], 400);
            }
            if (!$category->children->isEmpty() || !$category->grandChildren->isEmpty()) {
                return response()->json(['status' => 9, 'message' => trans('api.admin.categories.delete_err3')], 400);
            }
            $category->items()->sync([]);
            $category->delete();
            DB::commit();
            return response()->json(['status' => 1, 'message' => trans('api.admin.categories.delete_msg')], 200);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            DB::rollBack();
            return response()->json(['status' => 9, 'message' => trans('api.admin.categories.delete_err')], 500);
        }
    }
}

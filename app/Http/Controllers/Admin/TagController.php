<?php

namespace App\Http\Controllers\Admin;

use Throwable;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Resources\TagResource;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Http\Requests\admin\TagRequest;

class TagController extends Controller
{
    private $form_items = ['id', 'tag_name'];

    public function __construct()
    {
        $this->middleware('auth:admin');
    }

    public function index(Request $request)
    {
        try {
            return response()->json(['tags' => TagResource::collection(Tag::all())]);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            return response()->json(['status' => config('define.api_status.error'), 'message' => trans('api.admin.tags.get_err')], 500);
        }
    }

    public function store(TagRequest $request)
    {
        DB::beginTransaction();
        try {
            $data = $request->only($this->form_items);
            Tag::create([
                'tag_name' => $data['tag_name'],
            ]);
            DB::commit();
            return response()->json(['status' => config('define.api_status.success'), 'message' => trans('api.admin.tags.create_msg')], 200);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            DB::rollBack();
            return response()->json(['status' => config('define.api_status.error'), 'message' => trans('api.admin.tags.create_err')], 500);
        }
    }

    public function update(TagRequest $request, Tag $tag)
    {
        DB::beginTransaction();
        try {
            $data = $request->only($this->form_items);
            $tag->fill($data)->save();
            DB::commit();
            return response()->json(['status' => config('define.api_status.success'), 'message' => trans('api.admin.tags.update_msg')], 200);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            DB::rollBack();
            return response()->json(['status' => config('define.api_status.error'), 'message' => trans('api.admin.tags.update_err')], 500);
        }
    }

    public function destroy(Tag $tag)
    {
        DB::beginTransaction();
        try {
            if (!$tag->items->isEmpty() || !$tag->blogs->isEmpty() || !$tag->blogs->isEmpty()) {
                return response()->json(['status' => config('define.api_status.error'), 'message' => trans('api.admin.tags.delete_err2')], 400);
            }
            $tag->items()->sync([]);
            $tag->blogs()->sync([]);
            $tag->news()->sync([]);
            $tag->delete();
            DB::commit();
            return response()->json(['status' => config('define.api_status.success'), 'message' => trans('api.admin.tags.delete_msg')], 200);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            DB::rollBack();
            return response()->json(['status' => config('define.api_status.error'), 'message' => trans('api.admin.tags.delete_err')], 500);
        }
    }
}

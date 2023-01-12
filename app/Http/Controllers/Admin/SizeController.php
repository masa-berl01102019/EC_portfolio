<?php

namespace App\Http\Controllers\Admin;

use Throwable;
use App\Models\Item;
use App\Models\Size;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Http\Resources\SizeResource;
use App\Http\Requests\admin\SizeRequest;

class SizeController extends Controller
{
    private $form_items = ['id', 'size_name'];

    public function __construct()
    {
        $this->middleware('auth:admin');
    }

    public function index(Request $request)
    {
        try {
            return response()->json(['sizes' => SizeResource::collection(Size::all())]);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            return response()->json(['status' => 9, 'message' => trans('api.admin.sizes.get_err')], 500);
        }
    }

    public function store(SizeRequest $request)
    {
        DB::beginTransaction();
        try {
            $data = $request->only($this->form_items);
            Size::create([
                'size_name' => $data['size_name'],
            ]);
            DB::commit();
            return response()->json(['status' => 1, 'message' => trans('api.admin.sizes.create_msg')], 200);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            DB::rollBack();
            return response()->json(['status' => 9, 'message' => trans('api.admin.sizes.create_err')], 500);
        }
    }

    public function update(SizeRequest $request, Size $size)
    {
        DB::beginTransaction();
        try {
            $data = $request->only($this->form_items);
            $size->fill($data)->save();
            DB::commit();
            return response()->json(['status' => 1, 'message' => trans('api.admin.sizes.update_msg')], 200);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            DB::rollBack();
            return response()->json(['status' => 9, 'message' => trans('api.admin.sizes.update_err')], 500);
        }
    }

    public function destroy(Size $size)
    {
        DB::beginTransaction();
        try {
            $related_items_arr = Item::whereIn('id', $size->skus->pluck('item_id'))->pluck('product_number')->toArray();
            if (!empty($related_items_arr)) {
                return response()->json(['status' => 9, 'message' => trans('api.admin.sizes.delete_err2')], 400);
            }
            $size->delete();
            DB::commit();
            return response()->json(['status' => 1, 'message' => trans('api.admin.sizes.delete_msg')], 200);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            DB::rollBack();
            return response()->json(['status' => 9, 'message' => trans('api.admin.sizes.delete_err')], 500);
        }
    }
}

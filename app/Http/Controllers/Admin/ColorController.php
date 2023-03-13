<?php

namespace App\Http\Controllers\Admin;

use Throwable;
use App\Models\Item;
use App\Models\Color;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Http\Resources\ColorResource;
use App\Http\Requests\admin\ColorRequest;

class ColorController extends Controller
{
    private $form_items = ['id', 'color_name'];

    public function __construct()
    {
        $this->middleware('auth:admin');
    }

    public function index(Request $request)
    {
        try {
            return response()->json(['colors' => ColorResource::collection(Color::all())]);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            return response()->json(['status' => config('define.api_status.error'), 'message' => trans('api.admin.colors.get_err')], 500);
        }
    }

    public function store(ColorRequest $request)
    {
        DB::beginTransaction();
        try {
            $data = $request->only($this->form_items);
            Color::create([
                'color_name' => $data['color_name'],
            ]);
            DB::commit();
            return response()->json(['status' => config('define.api_status.success'), 'message' => trans('api.admin.colors.create_msg')], 200);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            DB::rollBack();
            return response()->json(['status' => config('define.api_status.error'), 'message' => trans('api.admin.colors.create_err')], 500);
        }
    }

    public function update(ColorRequest $request, Color $color)
    {
        DB::beginTransaction();
        try {
            $data = $request->only($this->form_items);
            $color->fill($data)->save();
            DB::commit();
            return response()->json(['status' => config('define.api_status.success'), 'message' => trans('api.admin.colors.update_msg')], 200);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            DB::rollBack();
            return response()->json(['status' => config('define.api_status.error'), 'message' => trans('api.admin.colors.update_err')], 500);
        }
    }

    public function destroy(Color $color)
    {
        DB::beginTransaction();
        try {
            $related_items_arr = Item::whereIn('id', $color->skus->pluck('item_id'))->pluck('product_number')->toArray();
            if (!empty($related_items_arr)) {
                return response()->json(['status' => config('define.api_status.error'), 'message' => trans('api.admin.colors.delete_err2')], 400);
            }
            $color->delete();
            DB::commit();
            return response()->json(['status' => config('define.api_status.success'), 'message' => trans('api.admin.colors.delete_msg')], 200);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            DB::rollBack();
            return response()->json(['status' => config('define.api_status.error'), 'message' => trans('api.admin.colors.delete_err')], 500);
        }
    }
}

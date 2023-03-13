<?php

namespace App\Http\Controllers\Admin;

use Throwable;
use App\Models\Brand;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Http\Resources\BrandResource;
use App\Http\Requests\admin\BrandRequest;

class BrandController extends Controller
{
    private $form_items = ['id', 'brand_name'];

    public function __construct()
    {
        $this->middleware('auth:admin');
    }

    public function index(Request $request)
    {
        try {
            return response()->json(['brands' => BrandResource::collection(Brand::all())]);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            return response()->json(['status' => config('define.api_status.error'), 'message' => trans('api.admin.brands.get_err')], 500);
        }
    }

    public function store(BrandRequest $request)
    {
        DB::beginTransaction();
        try {
            $data = $request->only($this->form_items);
            Brand::create([
                'brand_name' => $data['brand_name'],
            ]);
            DB::commit();
            return response()->json(['status' => config('define.api_status.success'), 'message' => trans('api.admin.brands.create_msg')], 200);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            DB::rollBack();
            return response()->json(['status' => config('define.api_status.error'), 'message' => trans('api.admin.brands.create_err')], 500);
        }
    }

    public function update(BrandRequest $request, Brand $brand)
    {
        DB::beginTransaction();
        try {
            $data = $request->only($this->form_items);
            $brand->fill($data)->save();
            DB::commit();
            return response()->json(['status' => config('define.api_status.success'), 'message' => trans('api.admin.brands.update_msg')], 200);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            DB::rollBack();
            return response()->json(['status' => config('define.api_status.error'), 'message' => trans('api.admin.brands.update_err')], 500);
        }
    }

    public function destroy(Brand $brand)
    {
        DB::beginTransaction();
        try {
            if (!$brand->items->isEmpty() || !$brand->news->isEmpty() || !$brand->blogs->isEmpty()) {
                return response()->json(['status' => config('define.api_status.error'), 'message' => trans('api.admin.brands.delete_err2')], 400);
            }
            $brand->delete();
            DB::commit();
            return response()->json(['status' => config('define.api_status.success'), 'message' => trans('api.admin.brands.delete_msg')], 200);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            DB::rollBack();
            return response()->json(['status' => config('define.api_status.error'), 'message' => trans('api.admin.brands.delete_err')], 500);
        }
    }
}

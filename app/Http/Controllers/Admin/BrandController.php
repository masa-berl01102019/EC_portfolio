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
            return response()->json(['status' => 9, 'message' => 'ブランドマスタの取得に失敗しました'], 500);
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
            return response()->json(['status' => 1, 'message' => 'ブランドマスタの登録を完了しました'], 200);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            DB::rollBack();
            return response()->json(['status' => 9, 'message' => 'ブランドマスタの登録に失敗しました'], 500);
        }
    }

    public function update(BrandRequest $request, Brand $brand)
    {
        DB::beginTransaction();
        try {
            $data = $request->only($this->form_items);
            $brand->fill($data)->save();
            DB::commit();
            return response()->json(['status' => 1, 'message' => 'ブランドマスタの編集を完了しました'], 200);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            DB::rollBack();
            return response()->json(['status' => 9, 'message' => 'ブランドマスタの編集に失敗しました'], 500);
        }
    }

    public function destroy(Brand $brand)
    {
        DB::beginTransaction();
        try {
            if (!$brand->items->isEmpty() || !$brand->news->isEmpty() || !$brand->blogs->isEmpty()) {
                return response()->json(['status' => 9, 'message' => '選択ブランドが商品・ニュース・ブログ等で使用されております'], 400);
            }
            $brand->delete();
            DB::commit();
            return response()->json(['status' => 1, 'message' => 'ブランドマスタの削除を完了しました'], 200);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            DB::rollBack();
            return response()->json(['status' => 9, 'message' => 'ブランドマスタの削除を失敗しました'], 500);
        }
    }
}

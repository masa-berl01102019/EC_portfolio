<?php

namespace App\Http\Controllers\Admin;

use Throwable;
use App\Models\Brand;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Http\Requests\admin\BrandRequest;

class BrandController extends Controller
{
    // TODO Resource APIでレスポンスの返却形式を決めるか要検討

    // 該当のカラム以外を扱わないようにホワイトリスト作成
    private $form_items = [ 'id', 'brand_name' ];

    public function __construct()
    {
        // Auth認証
        $this->middleware('auth:admin');
    }

    public function index(Request $request)
    {
        $brands = Brand::all();

        // レスポンスを返却
        return response()->json(['brands' => $brands],200);
    }

    public function store(BrandRequest $request)
    {
        // 不正な入力値の制御
        $data = $request->only($this->form_items);
        // DBに登録
        Brand::create([
            'brand_name' => $data['brand_name'],
        ]);
        // レスポンスを返却
        return response()->json(['create' => true, 'message' => 'ブランドマスタの新規登録を完了しました'], 200);
    }

    public function update(BrandRequest $request, Brand $brand)
    {
        // 項目制限
        $data = $request->only($this->form_items);
        // 編集項目をDBに保存
        $brand->fill($data)->save();
        // レスポンスを返却
        return response()->json(['update' => true, 'message' => 'ブランドマスタの編集を完了しました'], 200);
    }

    public function destroy(Request $request)
    {
        try {
            // インスタンスを生成して削除
            $brand = Brand::find($request->id);
            $brand->delete();
            // レスポンスを返却
            return response()->json(['delete' => true, 'message' => 'ブランドマスタの削除を完了しました'], 200);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            // インスタンスを生成
            $brand = Brand::find($request->id);
            $msg = !$brand->items->isEmpty() || !$brand->news->isEmpty() || !$brand->blogs->isEmpty() ? '選択ブランドが商品・ニュース・ブログ等で使用されております。': '';
            // レスポンスを返却
            return response()->json(['delete' => false, 'message' => 'ブランドの削除を失敗しました。'.$msg], 405);
        }
    }
}

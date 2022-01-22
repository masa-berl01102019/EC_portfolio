<?php

namespace App\Http\Controllers\Admin;

use Throwable;
use App\Models\Item;
use App\Models\Color;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Http\Requests\admin\ColorRequest;

class ColorController extends Controller
{
    // TODO Resource APIでレスポンスの返却形式を決めるか要検討

    // 該当のカラム以外を扱わないようにホワイトリスト作成
    private $form_items = [ 'id', 'color_name' ];

    public function __construct()
    {
        // Auth認証
        $this->middleware('auth:admin');
    }

    public function index(Request $request)
    {
        $colors = Color::all();

        // レスポンスを返却
        return response()->json(['colors' => $colors],200);
    }

    public function store(ColorRequest $request)
    {
        // 不正な入力値の制御
        $data = $request->only($this->form_items);
        // DBに登録
        Color::create([
            'color_name' => $data['color_name'],
        ]);
        // レスポンスを返却
        return response()->json(['create' => true, 'message' => 'カラーマスタの新規登録を完了しました'], 200);
    }

    public function update(ColorRequest $request, Color $color)
    {
        // 項目制限
        $data = $request->only($this->form_items);
        // 編集項目をDBに保存
        $color->fill($data)->save();
        // レスポンスを返却
        return response()->json(['update' => true, 'message' => 'カラーマスタの編集を完了しました'], 200);
    }

    public function destroy(Request $request)
    {
        try {
            // インスタンスを生成して削除
            $color = Color::find($request->id);
            $color->delete();
            // レスポンスを返却
            return response()->json(['delete' => true, 'message' => 'カラーマスタの削除を完了しました'], 200);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            // インスタンスを生成
            $color = Color::find($request->id);
            $related_items_id = $color->skus->pluck('item_id');
            $product_numbers = implode(' / ', Item::whereIn('id', $related_items_id)->pluck('product_number')->toArray());
            // レスポンスを返却
            return response()->json(['delete' => false, 'message' => 'カラーの削除を失敗しました。以下の品番の商品で選択カラーが使用されております。 商品マスタを編集画面にて選択カラーを変更してください。'.$product_numbers], 405);
        }
    }
}

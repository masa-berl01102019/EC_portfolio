<?php

namespace App\Http\Controllers\Admin;

use Throwable;
use App\Models\Item;
use App\Models\Size;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Http\Resources\SizeResource;
use App\Http\Requests\admin\SizeRequest;

class SizeController extends Controller
{
    // 該当のカラム以外を扱わないようにホワイトリスト作成
    private $form_items = [ 'id', 'size_name' ];

    public function __construct()
    {
        // Auth認証
        $this->middleware('auth:admin');
    }

    public function index(Request $request)
    {
        // レスポンスを返却
        return response()->json(['sizes' => SizeResource::collection(Size::all())],200);
    }

    public function store(SizeRequest $request)
    {
        // 不正な入力値の制御
        $data = $request->only($this->form_items);
        // DBに登録
        Size::create([
            'size_name' => $data['size_name'],
        ]);
        // レスポンスを返却
        return response()->json(['create' => true, 'message' => 'サイズマスタの新規登録を完了しました'], 200);
    }

    public function update(SizeRequest $request, Size $size)
    {
        // 項目制限
        $data = $request->only($this->form_items);
        // 編集項目をDBに保存
        $size->fill($data)->save();
        // レスポンスを返却
        return response()->json(['update' => true, 'message' => 'サイズマスタの編集を完了しました'], 200);
    }

    public function destroy(Size $size)
    {
        try {
            $size->delete();
            // レスポンスを返却
            return response()->json(['delete' => true, 'message' => 'サイズマスタの削除を完了しました'], 200);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            $related_items_id = $size->skus->pluck('item_id');
            $product_numbers = implode(' / ', Item::whereIn('id', $related_items_id)->pluck('product_number')->toArray());
            // レスポンスを返却
            return response()->json(['delete' => false, 'message' => 'サイズの削除を失敗しました。以下の品番の商品で選択サイズが使用されております。 商品マスタを編集画面にて選択サイズを変更してください。'.$product_numbers], 405);
        }
    }
}

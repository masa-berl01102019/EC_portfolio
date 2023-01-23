<?php

namespace App\Http\Controllers\Admin;

use Throwable;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Http\Requests\admin\CategoryEditRequest;
use App\Http\Requests\admin\CategoryRegisterRequest;

class CategoryController extends Controller
{
    // 該当のカラム以外を扱わないようにホワイトリスト作成
    private $form_items = [ 'id', 'category_name', 'parent_id'];

    public function __construct()
    {
        // Auth認証
        $this->middleware('auth:admin');
    }

    public function index(Request $request)
    {
        $categories = Category::whereIn('id', [1,2])->select('id', 'category_name', 'parent_id')->with(['children:id,category_name,parent_id', 'children.grandChildren:id,category_name,parent_id'])->get()->toArray();

        // レスポンスを返却
        return response()->json(['categories' => $categories],200);
    }

    public function store(CategoryRegisterRequest $request)
    {
        // 不正な入力値の制御
        $data = $request->only($this->form_items);
        // DBに登録
        Category::create([
            'category_name' => $data['category_name'],
            'parent_id' => $data['parent_id'],
        ]);
        // レスポンスを返却
        return response()->json(['create' => true, 'message' => 'カテゴリーマスタの新規登録を完了しました'], 200);
    }

    public function update(CategoryEditRequest $request, Category $category)
    {
        // 項目制限
        $data = $request->only($this->form_items);
        // 編集項目をDBに保存
        $category->fill($data)->save();
        // レスポンスを返却
        return response()->json(['update' => true, 'message' => 'カテゴリーマスタの編集を完了しました'], 200);
    }

    public function destroy(Category $category)
    {
        try {
            // 関連の中間テーブルの削除
            $category->items()->sync([]);
            // カテゴリーを削除
            $category->delete();
            // レスポンスを返却
            return response()->json(['delete' => true, 'message' => 'カテゴリーマスタの削除を完了しました'], 200);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            $msg1 = !$category->children->isEmpty() || !$category->grandChildren->isEmpty() ? '先に選択カテゴリに紐づく子カテゴリを削除する必要があります': '';
            $msg2 = !$category->items->isEmpty() || !$category->news->isEmpty() || !$category->blogs->isEmpty() ? '選択カテゴリーが商品・ニュース・ブログ等で使用されております。': '';
            
            // レスポンスを返却
            return response()->json(['delete' => false, 'message' => 'カテゴリーの削除を失敗しました。'.$msg1.$msg2], 405);
        }
    }
}

<?php

namespace App\Http\Controllers\Admin;

use Throwable;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Http\Requests\admin\TagRequest;

class TagController extends Controller
{
    // TODO Resource APIでレスポンスの返却形式を決めるか要検討

    // 該当のカラム以外を扱わないようにホワイトリスト作成
    private $form_items = [ 'id', 'tag_name' ];

    public function __construct()
    {
        // Auth認証
        $this->middleware('auth:admin');
    }

    public function index(Request $request)
    {
        $tags = Tag::all();

        // レスポンスを返却
        return response()->json(['tags' => $tags],200);
    }

    public function store(TagRequest $request)
    {
        // 不正な入力値の制御
        $data = $request->only($this->form_items);
        // DBに登録
        Tag::create([
            'tag_name' => $data['tag_name'],
        ]);
        // レスポンスを返却
        return response()->json(['create' => true, 'message' => 'タグの新規登録を完了しました'], 200);
    }

    public function update(TagRequest $request, Tag $tag)
    {
        // 項目制限
        $data = $request->only($this->form_items);
        // 編集項目をDBに保存
        $tag->fill($data)->save();
        // レスポンスを返却
        return response()->json(['update' => true, 'message' => 'タグの編集を完了しました'], 200);
    }

    public function destroy(Request $request)
    {
        try {
            // インスタンスを生成
            $tag = Tag::find($request->id);
            // 関連の中間テーブルの削除
            $tag->items()->sync([]);
            $tag->blogs()->sync([]);
            $tag->news()->sync([]);
            // タグの削除
            $tag->delete();
            // レスポンスを返却
            return response()->json(['delete' => true, 'message' => 'タグの削除を完了しました'], 200);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            // レスポンスを返却
            return response()->json(['delete' => false, 'message' => 'タグの削除を失敗しました。'], 405);
        }
    }
}

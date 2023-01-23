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
            return response()->json(['status' => 9, 'message' => 'タグマスタの取得に失敗しました'], 500);
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
            return response()->json(['status' => 1, 'message' => 'タグマスタの登録を完了しました'], 200);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            DB::rollBack();
            return response()->json(['status' => 9, 'message' => 'タグマスタの登録に失敗しました'], 500);
        }
    }

    public function update(TagRequest $request, Tag $tag)
    {
        DB::beginTransaction();
        try {
            $data = $request->only($this->form_items);
            $tag->fill($data)->save();
            DB::commit();
            return response()->json(['status' => 1, 'message' => 'タグマスタの編集を完了しました'], 200);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            DB::rollBack();
            return response()->json(['status' => 9, 'message' => 'タグマスタの編集に失敗しました'], 500);
        }
    }

    public function destroy(Tag $tag)
    {
        DB::beginTransaction();
        try {
            if (!$tag->items->isEmpty() || !$tag->blogs->isEmpty() || !$tag->blogs->isEmpty()) {
                return response()->json(['status' => 9, 'message' => '選択タグが商品・ニュース・ブログ等で使用されております'], 400);
            }
            $tag->items()->sync([]);
            $tag->blogs()->sync([]);
            $tag->news()->sync([]);
            $tag->delete();
            DB::commit();
            return response()->json(['status' => 1, 'message' => 'タグマスタの削除を完了しました'], 200);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            DB::rollBack();
            return response()->json(['status' => 9, 'message' => 'タグマスタの削除を失敗しました'], 500);
        }
    }
}

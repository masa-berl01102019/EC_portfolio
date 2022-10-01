<?php

namespace App\Http\Controllers\User;

use App\Models\Size;
use App\Models\Brand;
use App\Models\Color;
use App\Models\Bookmark;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Resources\SizeResource;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\BrandResource;
use App\Http\Resources\ColorResource;
use App\Http\Resources\BookmarkResource;
use App\Http\Requests\user\BookmarkRequest;

class BookmarkController extends Controller
{
    // 該当のカラム以外を扱わないようにホワイトリスト作成
    private $form_items = [ 'sku_id' ];

    public function __construct()
    {
        // Auth認証
        $this->middleware('auth:user');
    }

    public function index(Request $request)
    {
        $search_bookmark = Bookmark::query();

        $search_bookmark = $search_bookmark->where('user_id', Auth::guard('user')->user()->id)
            ->join('skus', 'bookmarks.sku_id', '=', 'skus.id')
            ->join('items', function ($join) {
                $join->on('items.id', '=', 'skus.item_id')->where('is_published', config('define.is_published_r.open'));
            })
            ->join('brands', 'items.brand_id', '=', 'brands.id')
            ->select('bookmarks.id', 'bookmarks.updated_at', 'bookmarks.sku_id','skus.item_id','skus.size_id','skus.color_id','items.item_name','items.price','items.brand_id','brands.brand_name');
        // * Resouce内でjoinしてないリレーションを呼び出す為にはきちんとselectでリレーション通りに外部キーを渡す必要がある
        // * Bookmark ModelでAccessorPriceTraitを読み込んでるので、上記のselectで該当の元カラム(price)を指定しておけばResouce内で$this->price_textで呼び出せる

        // フリーワード検索
        $search_bookmark->filterKeyword($request, ['item_name']);
        // ブランドのフィルター
        $search_bookmark->filterBrand($request, 'sku.item', 'brand_id');
        // カラーのフィルター
        $search_bookmark->filterColor($request, 'sku', 'color_id');
        // サイズのフィルター
        $search_bookmark->filterSize($request, 'sku', 'size_id');

        // 商品名順->価格順->更新日順の優先順位でソートされる仕組み

        // 商品名順でソート
        $search_bookmark->orderByItemName($request);
        // 価格順でソート
        $search_bookmark->orderByPrice($request);
        // 更新日でソート
        $search_bookmark->orderByUpdatedAt($request);

        // ページネーション
        $bookmarks = $search_bookmark->customPaginate($request);
        
        // レスポンスを返却
        return (BookmarkResource::collection($bookmarks))->additional([
            // 各種選択肢をmeta情報としてトップレベルに追加
            'brands' => BrandResource::collection(Brand::orderBy('brand_name', 'asc')->get()),
            'sizes' => SizeResource::collection(Size::orderBy('size_name', 'desc')->get()),
            'colors' => ColorResource::collection(Color::orderBy('color_name', 'asc')->get()),
        ]);
    }

    public function store(BookmarkRequest $request)
    {
        // 不正な入力値の制御
        $data = $request->only($this->form_items);
        // DBに登録
        Bookmark::create([
            'user_id' => Auth::guard('user')->user()->id,
            'sku_id' => $data['sku_id']
        ]);

        // レスポンスを返却
        return response()->json(['create' => true, 'message' => 'ブックマークの新規登録を完了しました'], 200);
    }

    public function destroy(Bookmark $bookmark)
    {
        $bookmark->delete();

        // レスポンスを返却
        return response()->json(['delete' => true, 'message' => 'ブックマークの削除を完了しました'], 200);
    }

}

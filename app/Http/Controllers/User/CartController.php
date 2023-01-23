<?php

namespace App\Http\Controllers\User;

use App\Models\Cart;
use App\Models\Size;
use App\Models\Brand;
use App\Models\Color;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Resources\CartResource;
use App\Http\Resources\SizeResource;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\BrandResource;
use App\Http\Resources\ColorResource;
use App\Http\Requests\user\CartEditRequest;
use App\Http\Requests\user\CartRegisterRequest;

class CartController extends Controller
{
    // 該当のカラム以外を扱わないようにホワイトリスト作成
    private $form_items = [ 'sku_id', 'quantity' ];

    public function __construct()
    {
        // Auth認証
        $this->middleware('auth:user');
    }

    public function index(Request $request)
    {
        $search_cart = Cart::query();

        $search_cart = $search_cart->where('user_id', Auth::guard('user')->user()->id)
            ->join('skus', 'carts.sku_id', '=', 'skus.id')
            ->join('items', function ($join) {
                $join->on('items.id', '=', 'skus.item_id')->where('is_published', config('define.is_published_r.open'));
            })
            ->join('brands', 'items.brand_id', '=', 'brands.id')
            ->select('carts.id','carts.quantity','carts.updated_at', 'carts.sku_id','skus.item_id','skus.size_id','skus.color_id','items.item_name','items.price','items.brand_id','brands.brand_name');
        // * Resouce内でjoinしてないリレーションを呼び出す為にはきちんとselectでリレーション通りに外部キーを渡す必要がある
        // * Bookmark ModelでAccessorPriceTraitを読み込んでるので、上記のselectで該当の元カラム(price)を指定しておけばResouce内で$this->price_textで呼び出せる

        // フリーワード検索
        $search_cart->filterKeyword($request, ['item_name']);
        // ブランドのフィルター
        $search_cart->filterBrand($request, 'sku.item', 'brand_id');
        // カラーのフィルター
        $search_cart->filterColor($request, 'sku', 'color_id');
        // サイズのフィルター
        $search_cart->filterSize($request, 'sku', 'size_id');

        // 商品名順->価格順->更新日順の優先順位でソートされる仕組み

        // 商品名順でソート
        $search_cart->orderByItemName($request);
        // 価格順でソート
        $search_cart->orderByPrice($request);
        // 更新日でソート
        $search_cart->orderByUpdatedAt($request);

        // ページネーション
        $carts = $search_cart->get();
        
        // レスポンスを返却
        return (CartResource::collection($carts))->additional([
            // 各種選択肢をmeta情報としてトップレベルに追加
            'brands' => BrandResource::collection(Brand::orderBy('brand_name', 'asc')->get()),
            'sizes' => SizeResource::collection(Size::orderBy('size_name', 'desc')->get()),
            'colors' => ColorResource::collection(Color::orderBy('color_name', 'asc')->get()),
            'user' => new UserResource(Auth::guard('user')->user())
        ]);
    }

    public function store(CartRegisterRequest $request)
    {
        // 不正な入力値の制御
        $data = $request->only($this->form_items);
        // DBに登録
        Cart::create([
            'user_id' => Auth::guard('user')->user()->id,
            'sku_id' => $data['sku_id'],
            'quantity' => 1,
        ]);

        // レスポンスを返却
        return response()->json(['create' => true, 'message' => 'カートの新規登録を完了しました'], 200);
    }

    public function update(CartEditRequest $request, Cart $cart)
    {
        // 項目制限
        $data = $request->only($this->form_items);
        // 基本情報をDBに保存
        $cart->fill([
            'quantity' => $data['quantity']
        ])->save();

        // レスポンスを返却
        return response()->json(['update' => true, 'message' => 'カートの編集を完了しました'], 200);
    }

    public function destroy(Cart $cart)
    {
        $cart->delete();

        // レスポンスを返却
        return response()->json(['delete' => true, 'message' => 'カートの削除を完了しました'], 200);
    }

}

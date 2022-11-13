<?php

namespace App\Http\Controllers\User;

use Throwable;
use App\Models\Cart;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Http\Resources\CartResource;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\user\CartEditRequest;
use App\Http\Requests\user\CartRegisterRequest;

class CartController extends Controller
{
    private $form_items = ['sku_id', 'quantity'];

    public function __construct()
    {
        $this->middleware('auth:user');
    }

    public function index(Request $request)
    {
        try {
            $search_cart = Cart::query();
            $search_cart = $search_cart->where('user_id', Auth::guard('user')->user()->id)
                ->join('skus', 'carts.sku_id', '=', 'skus.id')
                ->join('items', function ($join) {
                    $join->on('items.id', '=', 'skus.item_id')->where('is_published', config('define.is_published_r.open'))->where('items.deleted_at', null);
                })
                ->join('brands', 'items.brand_id', '=', 'brands.id')
                ->select('carts.id', 'carts.quantity', 'carts.updated_at', 'carts.sku_id', 'skus.item_id', 'skus.size_id', 'skus.color_id', 'items.item_name', 'items.price', 'items.brand_id', 'brands.brand_name')
                ->get();
            // I need pass foreign key at select func when I use join func so that I can call model which has relation at API Resources 
            // I can use Accessor (ex $this->price_text) at API Resources as long as I pass price at select func
            return (CartResource::collection($search_cart))->additional([
                'user' => new UserResource(Auth::guard('user')->user())
            ]);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            return response()->json(['status' => 9, 'message' => 'カート商品の取得に失敗しました'], 500);
        }
    }

    public function store(CartRegisterRequest $request)
    {
        DB::beginTransaction();
        try {
            $data = $request->only($this->form_items);
            Cart::create([
                'user_id' => Auth::guard('user')->user()->id,
                'sku_id' => $data['sku_id'],
                'quantity' => 1,
            ]);
            DB::commit();
            return response()->json(['status' => 1, 'message' => 'カート商品の登録を完了しました'], 200);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            DB::rollBack();
            return response()->json(['status' => 9, 'message' => 'カート商品の登録に失敗しました'], 500);
        }
    }

    public function update(CartEditRequest $request, Cart $cart)
    {
        DB::beginTransaction();
        try {
            $data = $request->only($this->form_items);
            $cart->fill([
                'quantity' => $data['quantity']
            ])->save();
            DB::commit();
            return response()->json(['status' => 1, 'message' => 'カート商品の編集を完了しました'], 200);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            DB::rollBack();
            return response()->json(['status' => 9, 'message' => 'カート商品の編集に失敗しました'], 500);
        }
    }

    public function destroy(Cart $cart)
    {
        DB::beginTransaction();
        try {
            $cart->delete();
            DB::commit();
            return response()->json(['status' => 1, 'message' => 'カート商品の削除を完了しました'], 200);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            DB::rollBack();
            return response()->json(['status' => 9, 'message' => 'カート商品の削除に失敗しました'], 500);
        }
    }
}

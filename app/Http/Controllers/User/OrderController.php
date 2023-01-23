<?php

namespace App\Http\Controllers\User;

use Throwable;
use App\Models\Tax;
use App\Models\Cart;
use App\Models\Size;
use App\Models\User;
use App\Models\Color;
use App\Models\Order;
use App\Models\OrderDetail;
use Illuminate\Http\Request;
use App\Mail\User\UserOrderMail;
use App\Mail\Admin\AdminOrderMail;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use App\Http\Requests\User\OrderRequest;
use App\Http\Resources\OrderDetailResource;

class OrderController extends Controller
{
    // 該当のカラム以外を扱わないようにホワイトリスト作成
    private $form_items = [ 'id', 'total_amount', 'payment_method', 'delivery_date', 'delivery_time' ];

    public function __construct()
    {
        // Auth認証
        $this->middleware('auth:user');
    }

    public function index(Request $request)
    {
        $search_order = OrderDetail::query();

        // 関連商品の取得
        $search_order = OrderDetail::with(['order', 'sku.item'])
            ->whereHas('order', function ($query) {
                // 該当ユーザーのオーダー商品に絞り込み
                return $query->where('user_id', Auth::guard('user')->user()->id);
            })
            ->whereHas('sku.item', function ($query) {
                // 商品は公開のステータスに絞り込み
                return $query->where('is_published', config('define.is_published_r.open'));
            });

        // ページネーション
        $orders = $search_order->customPaginate($request);
       
        // レスポンスを返却
        return (OrderDetailResource::collection($orders));
    }

    public function store(OrderRequest $request)
    {
        // 不正な入力値の制御
        $data = $request->only($this->form_items);

        // 該当ユーザーのカート情報取得
        $cart_items = Cart::where('user_id', Auth::guard('user')->user()->id)
            ->join('skus', 'carts.sku_id', '=', 'skus.id')
            ->join('items', function ($join) {
                $join->on('items.id', '=', 'skus.item_id')->where('is_published', config('define.is_published_r.open'));
            })
            ->select('carts.id','carts.quantity','carts.sku_id','skus.item_id','skus.size_id','skus.color_id','items.item_name','items.product_number','items.price')
            ->get();

        // 商品と点数と価格のみを抜き出し配列を生成
        $price_arr = array_column($cart_items->toArray(),'price');
        $quantity_arr = array_column($cart_items->toArray(),'quantity');

        // 商品の購入数と価格をそれぞれ掛ける
        $sub_total_arr = array_map(fn($price, $quantity): int => intval($price * $quantity), $price_arr, $quantity_arr);
        
        // 商品の各価格から消費税を算出して商品を掛ける * intval は小数点以下切り捨てかつ整数型に変換
        $tax_arr = array_map(fn($price, $quantity): int => intval($price * Tax::getTaxRate() * $quantity), $price_arr, $quantity_arr);

        // 小計を算出
        $sub_total = intval(array_sum($sub_total_arr));

        // 消費税の算出
        $tax_amount = intval(array_sum($tax_arr));

        // 購入総額を算出
        $total_amount = $sub_total + $tax_amount;
        
        // 決済時に商品の価格が変更されたもしくは不正に変更された
        if($data['total_amount'] != $total_amount) {
            return response()->json(['create' => false, 'message' => '商品の価格が一致しません'], 400);
        }

        // ストライプ手数料(3.6%)を算出 * ストライプの手数料は小数点以下を四捨五入しなければいけないのでround()をかませる
        $commission_fee = intval(round($total_amount * config('define.stripe_commision_fee')));

        DB::beginTransaction();
        try {
            // DBに登録
            $order = Order::create([
                'user_id' => Auth::guard('user')->user()->id,
                'sub_total' => $sub_total,
                'tax_amount' => $tax_amount,
                'total_amount' => $total_amount,
                'commission_fee' => $commission_fee,
                'payment_method' => $data['payment_method'],
                'payment_status' => config('define.payment_status_r.faile'), // APIが無事に実行される前は失敗という形にする
                'delivery_date' => $data['delivery_date'],
                'delivery_time' => $data['delivery_time'],
                'is_paid' => config('define.is_paid_r.paid'), // 現在クレジットカード決済のみなので基本的には入金済み扱いにする
                'is_shipped' => config('define.is_shipped_r.not_shipped'),
            ]);

            // 商品の数だけfor文まわす
            for($i = 0; $i < count($cart_items); $i++) {
                OrderDetail::create([
                    'order_id' => $order->id,
                    'sku_id' => $cart_items[$i]['sku_id'],
                    'item_name' => $cart_items[$i]['item_name'],
                    'product_number' => $cart_items[$i]['product_number'],
                    'order_price' => $cart_items[$i]['price'], // 税抜き価格
                    'order_color' => Color::find($cart_items[$i]['color_id'])->color_name,
                    'order_size' => Size::find($cart_items[$i]['size_id'])->size_name,
                    'order_quantity' => $cart_items[$i]['quantity'],
                ]);
                Cart::find($cart_items[$i]['id'])->delete();
            }

            // ストライプにて決済
            $payment = User::find(Auth::guard('user')->user()->id)->charge($total_amount, $data['id']);

            // 決済ステータスの更新
            $order->fill(['payment_status' => config('define.payment_status_r.success')])->save();

            // メール配信
            Mail::to(Auth::guard('user')->user()->email)->send(new UserOrderMail($order));
            Mail::to(config('define.admin_email.to.sales_report'))->send(new AdminOrderMail($order));

            DB::commit();
            return response()->json(['create' => true, 'message' => '決済を完了しました'], 200);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            DB::rollBack();
            return response()->json(['create' => false, 'message' => '決済に失敗しました'], 200);
        }


    }

}

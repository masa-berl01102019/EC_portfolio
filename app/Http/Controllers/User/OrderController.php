<?php

namespace App\Http\Controllers\User;

use Throwable;
use App\Models\Sku;
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
    private $form_items = ['id', 'total_amount', 'payment_method', 'delivery_date', 'delivery_time'];

    public function __construct()
    {
        $this->middleware('auth:user');
    }

    public function index(Request $request)
    {
        try {
            $orders = OrderDetail::with(['order'])
                ->whereHas('order', function ($query) {
                    return $query->where('user_id', Auth::guard('user')->user()->id);
                })
                ->orderBy('created_at', 'desc')->customPaginate($request);
            return (OrderDetailResource::collection($orders));
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            return response()->json(['status' => 9, 'message' => 'カート商品の取得に失敗しました'], 500);
        }
    }

    public function store(OrderRequest $request)
    {
        DB::beginTransaction();
        try {
            $data = $request->only($this->form_items);
            // get cart items
            $cart_items = Cart::where('user_id', Auth::guard('user')->user()->id)
                ->join('skus', 'carts.sku_id', '=', 'skus.id')
                ->join('items', function ($join) {
                    $join->on('items.id', '=', 'skus.item_id')->where('is_published', config('define.is_published_r.open'));
                })
                ->select('carts.id', 'carts.quantity', 'skus.quantity as stock', 'carts.sku_id', 'skus.item_id', 'skus.size_id', 'skus.color_id', 'items.item_name', 'items.product_number', 'items.price')
                ->get();

            // checking stock
            foreach ($cart_items as $items) {
                if ($items->stock < $items->quantity) {
                    return response()->json(['status' => 9, 'message' => '商品の注文数が在庫数を超えております'], 400);
                }
            }
            // put price and quantity of items out from collection
            $price_arr = array_column($cart_items->toArray(), 'price');
            $quantity_arr = array_column($cart_items->toArray(), 'quantity');
            // unit price multiplied by purchased quantity
            // intval => round down after the decimal point and variable type turn into integer
            $sub_total_arr = array_map(fn ($price, $quantity): int => intval($price * $quantity), $price_arr, $quantity_arr);
            // calculate the tax fee from unit price and multiplied by purchased quantity 
            $tax_arr = array_map(fn ($price, $quantity): int => (int)intval($price * Tax::getTaxRate()) * $quantity, $price_arr, $quantity_arr);
            // calculate subtotal amount / tax amount / total amount
            $sub_total = intval(array_sum($sub_total_arr));
            $tax_amount = intval(array_sum($tax_arr));
            $total_amount = $sub_total + $tax_amount;
            // checking total amount
            if ($data['total_amount'] != $total_amount) {
                return response()->json(['status' => 9, 'message' => '商品の価格が一致しません'], 400);
            }
            // caluculate stripe fee (3.6%) * stripe fee has to round after the decimal point
            $commission_fee = (int)round($total_amount * config('define.stripe_commision_fee'));

            // charge by stripe
            User::find(Auth::guard('user')->user()->id)->charge($total_amount, $data['id']);

            $order = Order::create([
                'user_id' => Auth::guard('user')->user()->id,
                'sub_total' => $sub_total,
                'tax_amount' => $tax_amount,
                'total_amount' => $total_amount,
                'commission_fee' => $commission_fee,
                'payment_method' => $data['payment_method'],
                'payment_status' => config('define.payment_status_r.success'),
                'delivery_date' => $data['delivery_date'],
                'delivery_time' => $data['delivery_time'],
                'is_paid' => config('define.is_paid_r.paid'),
                'is_shipped' => config('define.is_shipped_r.not_shipped')
            ]);

            for ($i = 0; $i < count($cart_items); $i++) {
                OrderDetail::create([
                    'order_id' => $order->id,
                    'sku_id' => $cart_items[$i]['sku_id'],
                    'item_name' => $cart_items[$i]['item_name'],
                    'product_number' => $cart_items[$i]['product_number'],
                    'order_price' => $cart_items[$i]['price'], // price exclude tax
                    'order_color' => Color::find($cart_items[$i]['color_id'])->color_name,
                    'order_size' => Size::find($cart_items[$i]['size_id'])->size_name,
                    'order_quantity' => $cart_items[$i]['quantity']
                ]);
                Cart::find($cart_items[$i]['id'])->delete();
                $sku = Sku::find($cart_items[$i]['sku_id']);
                $sku->fill([
                    'quantity' => (int)$cart_items[$i]['stock'] - (int)$cart_items[$i]['quantity']
                ])->save();
            }

            Mail::to(Auth::guard('user')->user()->email)->send(new UserOrderMail($order));
            Mail::to(config('define.admin_email.to.sales_report'))->send(new AdminOrderMail($order));
            DB::commit();
            return response()->json(['status' => 1, 'message' => '決済を完了しました'], 200);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            DB::rollBack();
            return response()->json(['status' => 9, 'message' => '決済に失敗しました'], 500);
        }
    }
}

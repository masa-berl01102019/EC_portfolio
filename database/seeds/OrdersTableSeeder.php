<?php

use App\Models\Color;
use App\Models\Item;
use App\Models\Order;
use App\Models\OrderDetail;
use App\Models\Size;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class OrdersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;'); // 一時的に外部キー制約を無効化

        DB::table('orders')->truncate(); // テーブルごと削除して再構築

        for($n = 0; $n < 100; $n++) {

            // 顧客IDをすべて配列で取得
            $users_id = User::pluck('id')->all();

            // ランダムで顧客IDの配列のキーを一つ取り出し
            $key = array_rand($users_id, 1);

            // 商品をランダムに1~5件インスタンスで取得
            $purchased_items = Item::inRandomOrder()->take(rand(1,5))->get();

            // 小計を算出
            $sub_total = $purchased_items->sum('price');

            // 消費税合計を算出
            $tax_amount = intval(floor($sub_total * 0.1));

            // 購入総額を算出
            $total_amount = $sub_total + $tax_amount;

            // 手数料を3%と想定し算出
            $commission_fee = intval(floor($total_amount * 0.03));

            // 決済種別
            $payment_method =rand(0, 1); // 0:クレジットカード 1:代引き

            // 決済ステータス
            $payment_status = rand(0, 1); // 0:決済済み 1:3D認証決済前

            // 入金の有無
            $is_paid = $payment_status === 0? rand(0, 1): 0; // 0:入金無し　1:入金有り

            // 配送の有無
            $is_shipped = $is_paid === 1? rand(0, 1): 0; // 0:未配送 1:配送済

            $order = Order::create([
                'user_id' => $users_id[$key],
                'sub_total' => $sub_total,
                'tax_amount' => $tax_amount,
                'total_amount' => $total_amount,
                'commission_fee' => $commission_fee,
                'payment_method' => $payment_method,
                'payment_status' => $payment_status,
                'is_paid' => $is_paid,
                'is_shipped' => $is_shipped,
            ]);

            for($i = 0; $i < count($purchased_items); $i++) {
                // ランダムに選ばれた商品に紐づくSKUのを取得
                $skus = $purchased_items[$i]->skus()->first();
                // SKUに紐づくカラーとサイズを取得
                $color = Color::find($skus->color_id)->color_name;
                $size = Size::find($skus->size_id)->size_name;
                //　注文テーブルと整合性がとれるようOrderDetailsのインスタンスを作成して保存
                OrderDetail::create([
                    'order_id' => $order->id,
                    'sku_id' => $skus->id,
                    'item_name' => $purchased_items[$i]->item_name,
                    'product_number' => $purchased_items[$i]->product_number,
                    'order_price' => $purchased_items[$i]->price,
                    'order_color' => $color,
                    'order_size' => $size,
                    'order_quantity' => 1,
                ]);
            }

        }


        DB::statement('SET FOREIGN_KEY_CHECKS=1;'); // 外部キー制約を有効化
    }
}

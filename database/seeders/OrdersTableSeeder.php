<?php
namespace Database\Seeders;

use App\Models\Tax;
use App\Models\Item;
use App\Models\Size;
use App\Models\User;
use App\Models\Color;
use App\Models\Order;
use App\Models\OrderDetail;
use Faker\Provider\DateTime;
use Illuminate\Support\Carbon;
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

        DB::table('order_details')->truncate(); // テーブルごと削除して再構築

        for($n = 0; $n < 1000; $n++) {

            // ランダムに会員インスタンスを取得
            $user = User::inRandomOrder()->first();

            if($user->gender == 0 || $user->gender == 1) { // 0:man 1:woman 2:others 3:no answer
                // 会員が男性か女性を判定して性別カテゴリのIDをセット * 1 => 'メンズ', 2 => 'レディース'
                $gender_category = $user->gender == 0 ? 1 : 2;
                // 該当の性別カテゴリの商品IDを配列に格納
                $items_id_arr = Item::with('categories')->whereHas('categories', function ($query) use ($gender_category) {
                    return $query->where('categories.id', $gender_category);
                })->pluck('id')->toArray();
                // 該当の商品をランダムに1~5件インスタンスで取得
                $purchased_items = Item::whereIn('id', $items_id_arr)->inRandomOrder()->take(rand(1,5))->get();
            } else {
                // 商品をランダムに1~5件インスタンスで取得
                $purchased_items = Item::inRandomOrder()->take(rand(1,5))->get();
            }

            // 小計を算出
            $sub_total = intval($purchased_items->sum('price'));

            // 商品の価格のみを抜き出し配列を生成
            $price_arr = array_column($purchased_items->toArray(),'price');
            
            // 商品の価格のそれぞれに消費税を掛ける
            $tax_arr = array_map(fn($item): int => intval($item * Tax::getTaxRate()), $price_arr);

            // 消費税の合計を算出
            $tax_amount = intval(array_sum($tax_arr));

            // 購入総額を算出
            $total_amount = $sub_total + $tax_amount;

            // 手数料を3.6%と想定し算出 * ストライプの手数料は小数点以下を四捨五入しなければいけないのでround()をかませる
            $commission_fee = intval(round($total_amount * config('define.stripe_commision_fee')));

            // 決済種別
            $payment_method =rand(0, 1); // 0:クレジットカード 1:代引き

            // 決済ステータス
            $payment_status = rand(0, 1); // 0:未決済 1:決済済

            // 入金の有無
            $is_paid = $payment_status === 1 ? rand(0, 1): 0; // 0:入金無し 1:入金有り

            // 配送の有無
            $is_shipped = $is_paid === 1? rand(0, 1): 0; // 0:未配送 1:配送済

            // dateTimeThisDecade() 過去10年のランダムな日付を取得→Carbon::instance()でDatetime型の日付からCarbonインスタンスを取得
            $first = Carbon::instance(DateTime::dateTimeThisDecade());
            $second = Carbon::instance(DateTime::dateTimeThisDecade());
            
            // オーダー作成日
            $created_at = $first->min($second); // 2つの日付のうち前のものを取得

            $delivery_time_zone = ['8:00 - 12:00', '14:00 - 16:00', '16:00 - 18:00', '18:00 - 20:00'];

            // ランダムで配達希望時間帯の配列のキーを一つ取り出し
            $key2 = array_rand($delivery_time_zone, 1);

            // オーダー更新日
            $updated_at = $is_paid === 1 || $is_shipped === 1 ? $first->max($second) : $created_at; // 2つの日付のうち先のものを取得

            $order = Order::create([
                'user_id' => $user->id,
                'sub_total' => $sub_total,
                'tax_amount' => $tax_amount,
                'total_amount' => $total_amount,
                'commission_fee' => $commission_fee,
                'payment_method' => $payment_method,
                'payment_status' => $payment_status,
                'delivery_date' => $updated_at,
                'delivery_time' => $delivery_time_zone[$key2],
                'is_paid' => $is_paid,
                'is_shipped' => $is_shipped,
                'created_at' => $created_at,
                'updated_at' => $updated_at
            ]);

            for($i = 0; $i < count($purchased_items); $i++) {
                // ランダムに選ばれた商品に紐づくSKUのを取得
                $skus = $purchased_items[$i]->skus()->first();
                // SKUに紐づくカラーとサイズを取得
                $color = Color::find($skus->color_id)->color_name;
                $size = Size::find($skus->size_id)->size_name;
                // 注文テーブルと整合性がとれるようOrderDetailsのインスタンスを作成して保存
                OrderDetail::create([
                    'order_id' => $order->id,
                    'sku_id' => $skus->id,
                    'item_name' => $purchased_items[$i]->item_name,
                    'product_number' => $purchased_items[$i]->product_number,
                    'order_price' => $purchased_items[$i]->price,
                    'order_color' => $color,
                    'order_size' => $size,
                    'order_quantity' => 1,
                    'created_at' => $created_at,
                    'updated_at' => $created_at
                ]);
            }

        }


        DB::statement('SET FOREIGN_KEY_CHECKS=1;'); // 外部キー制約を有効化
    }
}

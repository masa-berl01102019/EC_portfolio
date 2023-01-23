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
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        DB::table('orders')->truncate();

        DB::table('order_details')->truncate();

        for ($n = 0; $n < 1000; $n++) {

            // Get user instance randomly
            $user = User::inRandomOrder()->first();

            if ($user->gender == 0 || $user->gender == 1) { // 0:man 1:woman 2:others 3:no answer
                // Set gender category ID after checking if user is man or woman  * 1:men  2:women
                $gender_category = $user->gender == 0 ? 1 : 2;
                // Store item ID of gender category which is correspond with user's gender in array
                $items_id_arr = Item::with('categories')->whereHas('categories', function ($query) use ($gender_category) {
                    return $query->where('categories.id', $gender_category);
                })->pluck('id')->toArray();
                // Create instances of 1 to 5 items randomly 
                $purchased_items = Item::whereIn('id', $items_id_arr)->inRandomOrder()->take(rand(1, 5))->get();
            } else {
                // Create 1 to 5 instances of item  randomly
                $purchased_items = Item::inRandomOrder()->take(rand(1, 5))->get();
            }

            // calculate subtotal
            $sub_total = intval($purchased_items->sum('price'));

            // Extract only the item price and store it in array
            $price_arr = array_column($purchased_items->toArray(), 'price');

            // Calculate price including tax for each items 
            $tax_arr = array_map(fn ($item): int => intval($item * Tax::getTaxRate()), $price_arr);

            // Calculate the total amount of consumption tax
            $tax_amount = intval(array_sum($tax_arr));

            // Calculate the total amount of order price
            $total_amount = $sub_total + $tax_amount;

            // Caluculate stripe fee (3.6%) * stripe fee has to round after the decimal point
            $commission_fee = intval(round($total_amount * config('define.stripe_commision_fee')));

            // Set each status randomly
            $payment_method = rand(0, 1); // 0: Credit card 1: Cache
            $payment_status = rand(0, 1); // 0: Unsettled 1: Settled
            $is_paid = $payment_status === 1 ? rand(0, 1) : 0; // 0: Not paid 1: Paid
            $is_shipped = $is_paid === 1 ? rand(0, 1) : 0; // 0:Not delivered 1:Delivered

            // Get a random date in the last decade and create carbon instance
            $first = Carbon::instance(DateTime::dateTimeThisDecade());
            $second = Carbon::instance(DateTime::dateTimeThisDecade());

            // Get the oldest date between variables of first and second 
            $created_at = $first->min($second);

            $delivery_time_zone = ['8:00 - 12:00', '14:00 - 16:00', '16:00 - 18:00', '18:00 - 20:00'];

            // Extract one from an array which is stored preferred delivery time zone
            $key2 = array_rand($delivery_time_zone, 1);

            // Assign the latest date to variable of updated_at if order was paid or delivered.
            $updated_at = $is_paid === 1 || $is_shipped === 1 ? $first->max($second) : $created_at;

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

            for ($i = 0; $i < count($purchased_items); $i++) {
                // Get sku related with items randomly
                $skus = $purchased_items[$i]->skus()->first();
                // Get instances of color and size related with sku
                $color = Color::find($skus->color_id)->color_name;
                $size = Size::find($skus->size_id)->size_name;
                // Store item data which is correspond with the total amount of order
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

        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
}

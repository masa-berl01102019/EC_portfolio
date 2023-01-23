<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Models\Order;
use App\Models\OrderDetail;
use App\Models\Sku;
use Faker\Generator as Faker;

$factory->define(OrderDetail::class, function (Faker $faker) {

    // 注文IDをすべて配列で取得
    $orders_id = Order::pluck('id')->all();

    // ランダムで注文IDを一つ取り出し
    $order_id = $faker->randomElement($orders_id);

    // SKU IDをすべて配列で取得
    $skus_id = Sku::pluck('id')->all();

    // ランダムでSKU IDを一つ取り出し
    $sku_id = $faker->randomElement($skus_id);

    // ランダムでSKU IDを一つ取り出し
    $size = $faker->randomElement(['S','M','L']);

    return [
        'order_id' => $order_id,
        'sku_id' => $sku_id,
        'item_name' => $faker->realText(30),
        'product_number' => $faker->numberBetween($min = 100000000000, $max = 999999999999), // 12桁の数字
        'order_price' => $faker->numberBetween($min = 1000, $max = 15000),
        'order_color' => $faker->colorName,
        'order_size' => $size,
        'order_quantity' => $faker->numberBetween($min = 0, $max = 10000),
    ];

});

<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Models\Cart;
use App\Models\Sku;
use App\Models\User;
use Faker\Generator as Faker;

$factory->define(Cart::class, function (Faker $faker) {

    // 顧客IDをすべて配列で取得
    $users_id = User::pluck('id')->all();

    // ランダムで顧客IDを一つ取り出し
    $user_id = $faker->randomElement($users_id);

    // SKU IDをすべて配列で取得
    $skus_id = Sku::pluck('id')->all();

    // ランダムでSKU IDを一つ取り出し
    $sku_id = $faker->randomElement($skus_id);

    return [
        'user_id' => $user_id,
        'sku_id' => $sku_id,
        'quantity' => $faker->numberBetween($min = 0, $max = 10000),
    ];

});

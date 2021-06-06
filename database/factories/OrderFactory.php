<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */


use App\Models\Order;
use App\Models\User;
use Faker\Generator as Faker;

$factory->define(Order::class, function (Faker $faker) {

    // 顧客IDをすべて配列で取得
    $users_id = User::pluck('id')->all();

    // ランダムで顧客IDを一つ取り出し
    $user_id = $faker->randomElement($users_id);

    $sub_total = $faker->numberBetween($min = 0, $max = 100000);

    $tax_amount = intval(floor($sub_total * 0.1));

    $total_amount = $sub_total + $tax_amount;

    $commission_fee = intval(floor($total_amount * 0.03));

    // 決済種別
    $payment_method = $faker->numberBetween($min = 0, $max = 1); // 0:クレジットカード 1:代引き

    // 決済ステータス
    $payment_status = $faker->numberBetween($min = 0, $max = 1); // 0:決済済み 1:3D認証決済前

    // 入金の有無
    $is_paid = $payment_status === 0? $faker->numberBetween($min = 0, $max = 1): 0; // 0:入金無し　1:入金有り

    // 配送の有無
    $is_shipped = $is_paid === 1? $faker->numberBetween($min = 0, $max = 1): 0; // 0:未配送 1:配送済

    return [
        'user_id' => $user_id,
        'sub_total' => $sub_total,
        'tax_amount' => $tax_amount,
        'total_amount' => $total_amount,
        'commission_fee' => $commission_fee,
        'payment_method' => $payment_method,
        'payment_status' => $payment_status,
        'is_paid' => $is_paid,
        'is_shipped' => $is_shipped,
    ];

});

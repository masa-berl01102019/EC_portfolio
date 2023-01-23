<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Models\Admin;
use App\Models\Brand;
use App\Models\Item;
use Faker\Generator as Faker;

$factory->define(Item::class, function (Faker $faker) {

    // 管理者IDをすべて配列で取得
    $admins_id = Admin::pluck('id')->all();

    // ランダムで管理者IDを一つ取り出し
    $admin_id = $faker->randomElement($admins_id);

    // ブランドIDをすべて配列で取得
    $brands_id = Brand::pluck('id')->all();

    // ランダムでブランドIDを一つ取り出し
    $brand_id = $faker->randomElement($brands_id);

    // 公開状況
    $is_published = $faker->numberBetween($min = 0, $max = 1); // 0: 未公開　1: 公開

    // 公開日
    $posted_at = $faker->dateTimeBetween($startDate = '-10 years', $endDate = 'now', $timezone = null);

    // 更新日
    $modified_at = $faker->dateTimeBetween($startDate = $posted_at, $endDate = 'now', $timezone = null);

    // 原価
    $cost = $faker->numberBetween($min = 1000, $max = 15000);

    // 販売価格
    $price= $faker->numberBetween($min = $cost + 2500, $max = 60000);

    return [
        'brand_id' => $brand_id,
        'admin_id' => $admin_id,
        'item_name' => $faker->realText(30),
        'product_number' => $faker->numberBetween($min = 100000000000, $max = 999999999999), // 12桁の数字
        'price' => $price,
        'cost' => $cost,
        'description' => $faker->realText(500),
        'mixture_ratio' => $faker->realText(200),
        'made_in' => $faker->country,
        'is_published' => $is_published,
        'posted_at' => $is_published === 1? $posted_at: null,
        'modified_at' => $is_published === 1? $modified_at: null,
    ];

});

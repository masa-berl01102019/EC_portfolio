<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Models\Item;
use App\Models\Measurement;
use App\Models\Size;
use Faker\Generator as Faker;

$factory->define(Measurement::class, function (Faker $faker) {

    // 商品IDをすべて配列で取得
    $items_id = Item::pluck('id')->all();

    // ランダムで商品IDを一つ取り出し
    $item_id = $faker->randomElement($items_id);

    // サイズIDをすべて配列で取得
    $sizes_id = Size::pluck('id')->all();

    // ランダムでサイズIDを一つ取り出し
    $size_id = $faker->randomElement($sizes_id);

    // 商品IDからインスタンスを作成
    $item = Item::find($item_id);

    return [
        'item_id' => $item_id,
        'size_id' => $size_id,
        'width' => $faker->numberBetween($min = 0, $max = 100),
        'shoulder_width' => $faker->numberBetween($min = 0, $max = 100),
        'raglan_sleeve_length' => $faker->numberBetween($min = 0, $max = 100),
        'sleeve_length' => $faker->numberBetween($min = 0, $max = 100),
        'length' => $faker->numberBetween($min = 0, $max = 100),
        'waist' => $faker->numberBetween($min = 0, $max = 100),
        'hip' => $faker->numberBetween($min = 0, $max = 100),
        'rise' => $faker->numberBetween($min = 0, $max = 100),
        'inseam' => $faker->numberBetween($min = 0, $max = 100),
        'thigh_width' => $faker->numberBetween($min = 0, $max = 100),
        'outseam' => $faker->numberBetween($min = 0, $max = 100),
        'sk_length' => $faker->numberBetween($min = 0, $max = 100),
        'hem_width' => $faker->numberBetween($min = 0, $max = 100),
        'weight' => $faker->numberBetween($min = 0, $max = 100),
        'created_at' => $item->posted_at,
        'updated_at' => $item->modified_at,
    ];

});

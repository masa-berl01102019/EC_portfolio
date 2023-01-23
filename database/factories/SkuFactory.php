<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Models\Color;
use App\Models\Item;
use App\Models\Size;
use App\Models\Sku;
use Faker\Generator as Faker;

$factory->define(Sku::class, function (Faker $faker) {

    // 商品IDをすべて配列で取得
    $items_id = Item::pluck('id')->all();

    // ランダムで商品IDを一つ取り出し
    $item_id = $faker->randomElement($items_id);

    // サイズIDをすべて配列で取得
    $sizes_id = Size::pluck('id')->all();

    // ランダムでサイズIDを一つ取り出し
    $size_id = $faker->randomElement($sizes_id);

    // カラーIDをすべて配列で取得
    $colors_id = Color::pluck('id')->all();

    // ランダムでカラーIDを一つ取り出し
    $color_id = $faker->randomElement($colors_id);

    // 商品IDからインスタンスを作成
    $item = Item::find($item_id);

    return [
        'item_id' => $item_id,
        'size_id' => $size_id,
        'color_id' => $color_id,
        'quantity' => $faker->numberBetween($min = 0, $max = 10000),
        'created_at' => $item->posted_at,
        'updated_at' => $item->modified_at,
    ];

});

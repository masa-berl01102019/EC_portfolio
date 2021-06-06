<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Models\Image;
use App\Models\Item;
use Faker\Generator as Faker;

$factory->define(Image::class, function (Faker $faker) {

    // 商品IDをすべて配列で取得
    $items_id = Item::pluck('id')->all();

    // ランダムで商品IDを一つ取り出し
    $item_id = $faker->randomElement($items_id);

    return [
        'item_id' => $item_id,
        'image' => $faker->imageUrl($width = 640, $height = 480),
        'image_category' => $faker->numberBetween($min = 0, $max = 1), // 0: メイン画像, 1: サムネイル画像
    ];

});

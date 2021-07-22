<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Models\Admin;
use App\Models\Blog;
use App\Models\Brand;
use Faker\Generator as Faker;

$factory->define(Blog::class, function (Faker $faker) {

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

    return [
        'brand_id' => $brand_id,
        'admin_id' => $admin_id,
        'title' => $faker->realText(20),
        'body' => $faker->randomHtml(2, 3),
        'thumbnail' => $faker->imageUrl($width = 640, $height = 480),
        'is_published' => $is_published,
        'posted_at' => $is_published === 1? $posted_at: null,
        'modified_at' => $is_published === 1? $modified_at: null,
    ];

});
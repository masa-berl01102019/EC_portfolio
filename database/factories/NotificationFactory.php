<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Models\Admin;
use App\Models\Notification;
use Faker\Generator as Faker;

$factory->define(Notification::class, function (Faker $faker) {

    // 管理者IDをすべて配列で取得
    $admins_id = Admin::pluck('id')->all();

    // ランダムで管理者IDを一つ取り出し
    $admin_id = $faker->randomElement($admins_id);

    // 公開状況
    $is_published = $faker->numberBetween($min = 0, $max = 1); // 0: 未公開　1: 公開

    // 公開日
    $posted_at = $faker->dateTimeBetween($startDate = '-10 years', $endDate = 'now', $timezone = null);

    // 更新日
    $modified_at = $faker->dateTimeBetween($startDate = $posted_at, $endDate = 'now', $timezone = null);

    // 有効期限
    $expired_at = $faker->dateTimeBetween($startDate = $modified_at, $endDate = 'now', $timezone = null);

    return [
        'admin_id' => $admin_id,
        'title' => $faker->realText(20),
        'body' => $faker->realText(200),
        'is_published' => $is_published,
        'expired_at' => $is_published === 1? $expired_at: null,
        'posted_at' => $is_published === 1? $posted_at: null,
        'modified_at' => $is_published === 1? $modified_at: null,
    ];

});

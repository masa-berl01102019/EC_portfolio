<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Models\Admin;
use App\Models\Contact;
use App\Models\User;
use Faker\Generator as Faker;

$factory->define(Contact::class, function (Faker $faker) {

    // 会員IDをすべて配列で取得
    $users_id = User::pluck('id')->all();

    // nullを代入して問い合わせ者が会員でない可能性も含める
    $users_id[] = null;

    // ランダムで会員IDを一つ取り出し
    $user_id = $faker->randomElement($users_id);

    // 会員のインスタンス作成
    $user = User::find($user_id);

    // 管理者IDをすべて配列で取得
    $admins_id = Admin::pluck('id')->all();

    // ランダムで管理者IDを一つ取り出し
    $admin_id = $faker->randomElement($admins_id);

    // 対応状況フラグ
    $response_status = $faker->numberBetween($min = 0, $max = 2); // 0: 未対応　1: 対応中 2: 対応済

    // お問合せ日
    $created_at = $faker->dateTimeBetween($startDate = '-10 years', $endDate = 'now', $timezone = null);

    return [
        'user_id' => $user_id,
        'admin_id' => $response_status !== 0 ? $admin_id : null,
        'last_name' => empty($user)? $faker->lastName: $user->last_name,
        'first_name' => empty($user)? $faker->firstName: $user->first_name,
        'last_name_kana' => empty($user)? $faker->lastKanaName: $user->last_name_kana,
        'first_name_kana' => empty($user)? $faker->firstKanaName: $user->first_name_kana,
        'tel' => empty($user)? $faker->phoneNumber: $user->tel,
        'email' => empty($user)? $faker->safeEmail: $user->email,
        'title' => $faker->realText(20),
        'body' => $faker->realText(200),
        'response_status' => $response_status,
        'memo' => $response_status !== 0 ? $faker->realText(200) : null,
        'created_at' => $created_at,
        'updated_at' => $response_status === 0 ? null: $faker->dateTimeBetween($startDate = $created_at, $endDate = 'now', $timezone = null),
    ];

});

<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

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

    // 対応状況フラグ
    $response_status = $faker->numberBetween($min = 0, $max = 2); // 0: 未対応　1: 対応中 2: 対応済

    // お問合せ日
    $created_at = $faker->dateTimeBetween($startDate = '-10 years', $endDate = 'now', $timezone = null);

    return [
        'user_id' => $user_id,
        'last_name' => empty($user)? $faker->lastName: $user->last_name,
        'first_name' => empty($user)? $faker->firstName: $user->first_name,
        'last_name_kana' => empty($user)? $faker->lastKanaName: $user->last_name_kana,
        'first_name_kana' => empty($user)? $faker->firstKanaName: $user->first_name_kana,
        'tel' => empty($user)? $faker->phoneNumber: $user->tel,
        'email' => empty($user)? $faker->safeEmail: $user->email,
        'response_status' => $response_status,
        'created_at' => $created_at,
        'updated_at' => $response_status === 0 ? $created_at: $faker->dateTimeBetween($startDate = $created_at, $endDate = 'now', $timezone = null),
    ];

});

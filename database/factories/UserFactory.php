<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Faker\Generator as Faker;

/*
|--------------------------------------------------------------------------
| Model Factories
|--------------------------------------------------------------------------
|
| This directory should contain each of the model factory definitions for
| your application. Factories provide a convenient way to generate new
| model instances for testing / seeding your application's database.
|
*/

$factory->define(User::class, function (Faker $faker) {

    // ユーザー登録日
    $created_at = $faker->dateTimeBetween($startDate = '-10 years', $endDate = 'now', $timezone = null);
    // ユーザー性別
    $gender = $faker->numberBetween($min = 0, $max = 3); // 0:man 1:woman 2:others 3:no answer
    // お届け先が現住所以外で登録されているか判定フラグ
    $flg = $faker->numberBetween($min = 0, $max = 1); // 0: 登録なし　1: 登録あり

    return [
        'last_name' => $faker->lastName,
        'first_name' => $gender === 0 || $gender === 2? $faker->firstNameMale: $faker->firstNameFemale,
        'last_name_kana' => $faker->lastKanaName,
        'first_name_kana' => $gender === 0 || $gender === 2? $faker->firstKanaNameMale: $faker->firstKanaNameFemale,
        'gender' => $gender,
        'birthday' => $faker->date($format = 'Y-m-d', $max = '-18 years'),
        'post_code' => $faker->postcode,
        'prefecture' => $faker->prefecture,
        'municipality' => $faker->city,
        'street_name' => $faker->streetName,
        'street_number' => '1-1-1',
        'building' => $faker->randomElement([$faker->secondaryAddress, null]), // 建物名がある場合とない場合の想定
        'delivery_post_code' => $flg === 1? $faker->postcode: null,
        'delivery_prefecture' => $flg === 1? $faker->prefecture: null,
        'delivery_municipality' => $flg === 1? $faker->city: null,
        'delivery_street_name' => $flg === 1? $faker->streetName: null,
        'delivery_street_number' => $flg === 1? '1-1-1': null,
        'delivery_building' => $flg === 1? $faker->randomElement([$faker->secondaryAddress, null]): null,
        'tel' => $faker->phoneNumber,
        'email' => $faker->unique()->safeEmail,
        'password' => Hash::make('abc12345'),
        'is_received' => $faker->numberBetween($min = 0, $max = 1),
//        'email_verified_at' => now(), メールアドレス認証してからログインする方式にするか検討中
        'remember_token' => Str::random(10),
        'created_at' => $created_at,
        'updated_at' => $faker->dateTimeBetween($startDate = $created_at, $endDate = 'now', $timezone = null),
    ];
});

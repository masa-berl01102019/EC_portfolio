<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Models\Admin;
use Faker\Generator as Faker;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

$factory->define(Admin::class, function (Faker $faker) {

    // ユーザー登録日
    $created_at = $faker->dateTimeBetween($startDate = '-10 years', $endDate = 'now', $timezone = null);
    // ユーザー性別
    $gender = $faker->numberBetween($min = 0, $max = 3); // 0:man 1:woman 2:others 3:no answer

    return [
        'last_name' => $faker->lastName,
        'first_name' => $gender === 0 || $gender === 2? $faker->firstNameMale: $faker->firstNameFemale,
        'last_name_kana' => $faker->lastKanaName,
        'first_name_kana' => $gender === 0 || $gender === 2? $faker->firstKanaNameMale: $faker->firstKanaNameFemale,
        'tel' => $faker->phoneNumber,
        'email' => $faker->unique()->safeEmail,
        'password' => Hash::make('abc12345'),
//        'email_verified_at' => now(), メールアドレス認証してからログインする方式にするか検討中
        'remember_token' => Str::random(10),
        'created_at' => $created_at,
        'updated_at' => $faker->dateTimeBetween($startDate = $created_at, $endDate = 'now', $timezone = null),
    ];

});

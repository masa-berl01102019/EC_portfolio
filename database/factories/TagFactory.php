<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Models\Tag;
use Faker\Generator as Faker;

$factory->define(Tag::class, function (Faker $faker) {

    // タグ登録日
    $created_at = $faker->dateTimeBetween($startDate = '-10 years', $endDate = 'now', $timezone = null);

    return [
        'tag_name' => $faker->word,
        'created_at' => $created_at,
        'updated_at' => $faker->dateTimeBetween($startDate = $created_at, $endDate = 'now', $timezone = null),
    ];
});

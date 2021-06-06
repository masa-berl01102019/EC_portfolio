<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Models\Color;
use Faker\Generator as Faker;

$factory->define(Color::class, function (Faker $faker) {

    return [
        'color_name' => $faker->unique()->colorName,
        'created_at' => '2010-04-01 00:00:00',
        'updated_at' => '2010-04-01 00:00:00',
    ];

});

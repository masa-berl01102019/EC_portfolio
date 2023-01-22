<?php

namespace Database\Factories;

use App\Models\Admin;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Eloquent\Factories\Factory;

class AdminFactory extends Factory
{
    protected $model = Admin::class;

    public function definition()
    {

        $created_at = $this->faker->dateTimeBetween($startDate = '-10 years', $endDate = 'now', $timezone = null);

        $gender = $this->faker->numberBetween($min = 0, $max = 3); // 0:man 1:woman 2:others 3:no answer

        return [
            'last_name' => $this->faker->lastName,
            'first_name' => $gender === 0 || $gender === 2 ? $this->faker->firstNameMale : $this->faker->firstNameFemale,
            'last_name_kana' => $this->faker->lastKanaName,
            'first_name_kana' => $gender === 0 || $gender === 2 ? $this->faker->firstKanaNameMale : $this->faker->firstKanaNameFemale,
            'tel' => $this->faker->phoneNumber,
            'email' => $this->faker->unique()->safeEmail,
            'password' => Hash::make('abc12345'),
            'email_verified_at' => now(),
            'created_at' => $created_at,
            'updated_at' => $this->faker->dateTimeBetween($startDate = $created_at, $endDate = 'now', $timezone = null),
        ];
    }
}

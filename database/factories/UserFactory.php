<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Eloquent\Factories\Factory;

class UserFactory extends Factory
{
    protected $model = User::class;

    public function definition()
    {
        $created_at = $this->faker->dateTimeBetween($startDate = '-10 years', $endDate = 'now', $timezone = null);

        $gender = $this->faker->numberBetween($min = 0, $max = 3); // 0:man 1:woman 2:others 3:no answer
        // It's a flag checking whether delivery address is registered or not
        $flg = $this->faker->numberBetween($min = 0, $max = 1); // 0: not registered 1: registered

        return [
            'last_name' => $this->faker->lastName,
            'first_name' => $gender === config('define.gender.man') || $gender === config('define.gender.others') ? $this->faker->firstNameMale : $this->faker->firstNameFemale,
            'last_name_kana' => $this->faker->lastKanaName,
            'first_name_kana' => $gender === config('define.gender.man') || $gender === config('define.gender.others') ? $this->faker->firstKanaNameMale : $this->faker->firstKanaNameFemale,
            'gender' => $gender,
            'birthday' => $this->faker->date($format = 'Y-m-d', $max = '-18 years'),
            'post_code' => $this->faker->postcode,
            'prefecture' => $this->faker->prefecture,
            'municipality' => $this->faker->city,
            'street_name' => $this->faker->streetName,
            'street_number' => '1-1-1',
            'building' => $this->faker->randomElement([$this->faker->secondaryAddress, null]),
            'delivery_post_code' => $flg === 1 ? $this->faker->postcode : null,
            'delivery_prefecture' => $flg === 1 ? $this->faker->prefecture : null,
            'delivery_municipality' => $flg === 1 ? $this->faker->city : null,
            'delivery_street_name' => $flg === 1 ? $this->faker->streetName : null,
            'delivery_street_number' => $flg === 1 ? '1-1-1' : null,
            'delivery_building' => $flg === 1 ? $this->faker->randomElement([$this->faker->secondaryAddress, null]) : null,
            'tel' => $this->faker->phoneNumber,
            'email' => $this->faker->unique()->safeEmail,
            'password' => Hash::make('abc12345'),
            'is_received' => $this->faker->numberBetween($min = 0, $max = 1),
            'email_verified_at' => now(),
            // In case that there are limited products etc.
            // It's necessary to take measures such as adding authentication of email addresses etc to the requirements so that user can't create account easily.
            'created_at' => $created_at,
            'updated_at' => $this->faker->dateTimeBetween($startDate = $created_at, $endDate = 'now', $timezone = null),
        ];
    }
}

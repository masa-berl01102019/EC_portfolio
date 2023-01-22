<?php

namespace Database\Factories;

use App\Models\Admin;
use App\Models\Contact;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ContactFactory extends Factory
{
    protected $model = Contact::class;

    public function definition()
    {
        // Get all of user ID in array
        $users_id = User::pluck('id')->all();

        // Extract an user ID randomly * Adjusted so that contact from the general public is 30%
        $user_id = $this->faker->optional($weight = 0.7, $default = null)->randomElement($users_id);

        // Create the instance of user
        $user = User::find($user_id);

        // Get the instance of admin randomly
        $admin = Admin::inRandomOrder()->first();

        $response_status = $this->faker->numberBetween($min = 0, $max = 2); // 0:Yet 1:During 2:Done

        $created_at = $this->faker->dateTimeBetween($startDate = '-10 years', $endDate = 'now', $timezone = null);

        return [
            'user_id' => $user_id,
            'admin_id' => $response_status !== 0 ? $admin->id : null,
            'last_name' => empty($user) ? $this->faker->lastName : $user->last_name,
            'first_name' => empty($user) ? $this->faker->firstName : $user->first_name,
            'last_name_kana' => empty($user) ? $this->faker->lastKanaName : $user->last_name_kana,
            'first_name_kana' => empty($user) ? $this->faker->firstKanaName : $user->first_name_kana,
            'tel' => empty($user) ? $this->faker->phoneNumber : $user->tel,
            'email' => empty($user) ? $this->faker->safeEmail : $user->email,
            'subject' => $this->faker->text($maxNbChars = 20),
            'message' => $this->faker->text($maxNbChars = 200),
            'response_status' => $response_status,
            'memo' => $response_status !== 0 ? $this->faker->text($maxNbChars = 200) : null,
            'created_at' => $created_at,
            'updated_at' => $response_status === 0 ? null : $this->faker->dateTimeBetween($startDate = $created_at, $endDate = 'now', $timezone = null),
        ];
    }
}

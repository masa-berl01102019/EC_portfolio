<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Eloquent\Factories\Factory;

class UserFactory extends Factory
{
    protected $model = User::class;

    public function definition()
    {
        // ユーザー登録日
        $created_at = $this->faker->dateTimeBetween($startDate = '-10 years', $endDate = 'now', $timezone = null);
        // ユーザー性別
        $gender = $this->faker->numberBetween($min = 0, $max = 3); // 0:man 1:woman 2:others 3:no answer
        // お届け先が現住所以外で登録されているか判定フラグ
        $flg = $this->faker->numberBetween($min = 0, $max = 1); // 0: 登録なし 1: 登録あり

        return [
            'last_name' => $this->faker->lastName,
            'first_name' => $gender === 0 || $gender === 2 ? $this->faker->firstNameMale : $this->faker->firstNameFemale,
            'last_name_kana' => $this->faker->lastKanaName,
            'first_name_kana' => $gender === 0 || $gender === 2 ? $this->faker->firstKanaNameMale : $this->faker->firstKanaNameFemale,
            'gender' => $gender,
            'birthday' => $this->faker->date($format = 'Y-m-d', $max = '-18 years'),
            'post_code' => $this->faker->postcode,
            'prefecture' => $this->faker->prefecture,
            'municipality' => $this->faker->city,
            'street_name' => $this->faker->streetName,
            'street_number' => '1-1-1',
            'building' => $this->faker->randomElement([$this->faker->secondaryAddress, null]), // 建物名がある場合とない場合の想定
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
            // メールアドレス認証してからログインする方式にする場合
            // 数量限定の商品等がある想定の場合、メールアドレス・電話番号の認証を要件に追加して容易に作れないようにする等の対策が必要
            'created_at' => $created_at,
            'updated_at' => $this->faker->dateTimeBetween($startDate = $created_at, $endDate = 'now', $timezone = null),
        ];
    }
}

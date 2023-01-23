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
        // 会員IDをすべて配列で取得
        $users_id = User::pluck('id')->all();

        // ランダムで会員IDを一つ取り出し 30%の確率で会員以外の問い合わせ
        $user_id = $this->faker->optional($weight = 0.7, $default = null)->randomElement($users_id);

        // 会員のインスタンス作成
        $user = User::find($user_id);

        // ランダムに管理者インスタンスを取得
        $admin = Admin::inRandomOrder()->first();

        // 対応状況フラグ
        $response_status = $this->faker->numberBetween($min = 0, $max = 2); // 0: 未対応 1: 対応中 2: 対応済

        // お問合せ日
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

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

        // nullを代入して問い合わせ者が会員でない可能性も含める
        $users_id[] = null;

        // ランダムで会員IDを一つ取り出し
        $user_id = $this->faker->randomElement($users_id);

        // 会員のインスタンス作成
        $user = User::find($user_id);

        // 管理者IDをすべて配列で取得
        $admins_id = Admin::pluck('id')->all();

        // ランダムで管理者IDを一つ取り出し
        $admin_id = $this->faker->randomElement($admins_id);

        // 対応状況フラグ
        $response_status = $this->faker->numberBetween($min = 0, $max = 2); // 0: 未対応　1: 対応中 2: 対応済

        // お問合せ日
        $created_at = $this->faker->dateTimeBetween($startDate = '-10 years', $endDate = 'now', $timezone = null);

        return [
            'user_id' => $user_id,
            'admin_id' => $response_status !== 0 ? $admin_id : null,
            'last_name' => empty($user)? $this->faker->lastName: $user->last_name,
            'first_name' => empty($user)? $this->faker->firstName: $user->first_name,
            'last_name_kana' => empty($user)? $this->faker->lastKanaName: $user->last_name_kana,
            'first_name_kana' => empty($user)? $this->faker->firstKanaName: $user->first_name_kana,
            'tel' => empty($user)? $this->faker->phoneNumber: $user->tel,
            'email' => empty($user)? $this->faker->safeEmail: $user->email,
            'title' => $this->faker->realText(20),
            'body' => $this->faker->realText(200),
            'response_status' => $response_status,
            'memo' => $response_status !== 0 ? $this->faker->realText(200) : null,
            'created_at' => $created_at,
            'updated_at' => $response_status === 0 ? null: $this->faker->dateTimeBetween($startDate = $created_at, $endDate = 'now', $timezone = null),
        ];
    }
}

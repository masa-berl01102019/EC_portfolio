<?php

namespace Database\Factories;

use App\Models\Cart;
use App\Models\Sku;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class CartFactory extends Factory
{
    protected $model = Cart::class;

    public function definition()
    {
        // 顧客IDをすべて配列で取得
        $users_id = User::pluck('id')->all();

        // ランダムで顧客IDを一つ取り出し
        $user_id = $this->faker->randomElement($users_id);

        // ユーザーのインスタンスを取得
        $user = User::find($user_id);

        // SKU IDをすべて配列で取得
        $skus_id = Sku::pluck('id')->all();

        // ランダムでSKU IDを一つ取り出し
        $sku_id = $this->faker->randomElement($skus_id);

        // ユーザーのインスタンスを取得
        $sku = Sku::find($sku_id);

        // 商品が登録されてないもしくはユーザーが登録さてない状態ではブックマーク出来ないので、作成日を比較して最新の日時を取得
        $created_date = ($user->created_at > $sku->created_at)? $user->created_at: $sku->created_at;

        return [
            'user_id' => $user_id,
            'sku_id' => $sku_id,
            'quantity' => $this->faker->numberBetween($min = 1, $max = 3),
            'created_at' => $created_date,
            'updated_at' => $this->faker->dateTimeBetween($startDate = $created_date, $endDate = 'now', $timezone = null),
        ];
    }
}

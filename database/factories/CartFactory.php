<?php

namespace Database\Factories;

use App\Models\Sku;
use App\Models\Cart;
use App\Models\Item;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class CartFactory extends Factory
{
    protected $model = Cart::class;

    public function definition()
    {
        // ランダムに会員インスタンスを取得
        $user = User::inRandomOrder()->first();

        if($user->gender == 0 || $user->gender == 1) { // 0:man 1:woman 2:others 3:no answer
            // 会員が男性か女性を判定して性別カテゴリのIDをセット * 1 => 'メンズ', 2 => 'レディース'
            $gender_category = $user->gender == 0 ? 1 : 2;
            // 該当の性別カテゴリの商品IDを配列に格納
            $items_id_arr = Item::with('categories')->whereHas('categories', function ($query) use ($gender_category) {
                return $query->where('categories.id', $gender_category);
            })->pluck('id')->toArray();
            // ランダムに商品IDを取り出し該当のSKUの中からさらにランダムに1つインスタンスを取得
            $sku = Sku::where('item_id', $this->faker->randomElement($items_id_arr))->inRandomOrder()->first();
        } else {
            // ランダムにSKUインスタンスを取得
            $sku = Sku::inRandomOrder()->first();
        }

        // 商品が登録されてないもしくはユーザーが登録さてない状態ではブックマーク出来ないので、作成日を比較して最新の日時を取得
        $created_date = ($user->created_at > $sku->created_at)? $user->created_at: $sku->created_at;

        return [
            'user_id' => $user->id,
            'sku_id' => $sku->id,
            'quantity' => $this->faker->numberBetween($min = 1, $max = 3),
            'created_at' => $created_date,
            'updated_at' => $this->faker->dateTimeBetween($startDate = $created_date, $endDate = 'now', $timezone = null),
        ];
    }
}

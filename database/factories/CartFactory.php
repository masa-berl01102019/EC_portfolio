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
        // Get the instance of user randomly
        $user = User::inRandomOrder()->first();


        if ($user->gender == config('define.gender.man') || $user->gender == config('define.gender.woman')) { // 0:man 1:woman 2:others 3:no answer
            // Set gender category ID after checking if user is man or woman  * 1:men  2:women
            $gender_category = $user->gender == config('define.gender.man') ? config('define.gender_category.men') : config('define.gender_category.women');

            // Store item ID of gender category which is correspond with user's gender in array
            $items_id_arr = Item::with('categories')->whereHas('categories', function ($query) use ($gender_category) {
                return $query->where('categories.id', $gender_category);
            })->pluck('id')->toArray();
            // Get random item ID from an array, and get an instance of sku which is related with this item id randomly
            $sku = Sku::where('item_id', $this->faker->randomElement($items_id_arr))->inRandomOrder()->first();
        } else {
            // Get the instance of sku randomly
            $sku = Sku::inRandomOrder()->first();
        }

        // Get the latest date compare with created date of user and sku
        $created_date = ($user->created_at > $sku->created_at) ? $user->created_at : $sku->created_at;

        return [
            'user_id' => $user->id,
            'sku_id' => $sku->id,
            'quantity' => $this->faker->numberBetween($min = 1, $max = 3),
            'created_at' => $created_date,
            'updated_at' => $this->faker->dateTimeBetween($startDate = $created_date, $endDate = 'now', $timezone = null),
        ];
    }
}

<?php
namespace Database\Seeders;

use App\Models\Item;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ItemsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;'); // 一時的に外部キー制約を無効化 

        DB::table('items')->truncate(); // テーブルごと削除して再構築

        Item::factory()->count(400)->create();

        // 全商品の品番の配列で取得
        $items = Item::pluck('product_number')->all();
        //array_count_valuesを使用して値の使用回数をカウントする
        $item_count = array_count_values($items);
        // 重複品番の削除
        foreach($item_count as $key => $value){
            // 重複した品番が一個以上か判定
            if($value > 1) {
                Log::info($key.'は'.$value.'個');
                $count = (int)$value;
                // 重複がなくなるまで削除する
                while($count > 1) {
                    // 該当品番の商品のインスタンスを取得
                    $item = Item::where('product_number', $key)->first();
                    // 該当品番の商品を削除
                    $item->delete();
                    $count--;
                }
            }
        }

        DB::statement('SET FOREIGN_KEY_CHECKS=1;'); // 外部キー制約を有効化
    }
}

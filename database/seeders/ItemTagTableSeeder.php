<?php
namespace Database\Seeders;

use App\Models\Item;
use App\Models\Tag;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ItemTagTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;'); // 一時的に外部キー制約を無効化

        DB::table('item_tag')->truncate(); // テーブルごと削除して再構築

        // 商品を全件取得
        $items = Item::all();

        // 配列の初期化
        $item_tag = [];

        // タグIDをすべて配列で取得
        $tags_id = Tag::pluck('id')->all();

        // for文で展開
        foreach($items as $item) {

            // 2~6個のランダムなタグIDの配列を生成
            $random_tag_arr = array_rand($tags_id, rand(2,6));

            for($n = 0; $n < count($random_tag_arr); $n++) {
                $item_tag[] = [
                    'item_id' => $item->id,
                    'tag_id' => $random_tag_arr[$n],
                ];
            }
        }

        DB::table('item_tag')->insert($item_tag); // データの挿入

        DB::statement('SET FOREIGN_KEY_CHECKS=1;'); // 外部キー制約を有効化
    }
}

<?php

namespace Database\Seeders;

use App\Models\Item;
use App\Models\Size;
use App\Models\Color;
use App\Models\Image;
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
        // Yahoo APIの仕様変更により、1分間に30リクエストしか送れないので修正 件数の調整はfactoryで指定する

        DB::statement('SET FOREIGN_KEY_CHECKS=0;'); // 一時的に外部キー制約を無効化 

        // テーブルごと削除して再構築
        DB::table('items')->truncate();
        DB::table('colors')->truncate();
        DB::table('sizes')->truncate();
        DB::table('images')->truncate();
        DB::table('measurements')->truncate();
        DB::table('skus')->truncate();
        DB::table('category_item')->truncate();

        // make()でコレクションが返ってくるので配列に変換
        $factory_items = Item::factory()->count(1)->make()->toArray();

        // シリアライズ時に追加されるカラム
        $appends = ['is_published_text', 'price_text', 'cost_text', 'included_tax_price', 'included_tax_price_text'];

        // bulkでinsert時に邪魔なので削除
        foreach ($appends as $value) {
            //削除実行
            unset($factory_items[0][$value]);
        }

        // 商品の登録
        DB::table('items')->insert($factory_items[0]['items']);

        // データ不整合を防ぐ為に正しくデータ取得出来なかった品番は削除する
        Item::where('product_number', '')->orWhere('mixture_ratio', '')->orWhere('made_in', '')->delete();

        // カラーマスターの登録
        foreach ($factory_items[0]['color_masters'] as $value) {
            // データの挿入
            DB::table('colors')->insert([
                'color_name' => $value,
                'created_at' => '2010-04-01 00:00:00',
                'updated_at' => '2010-04-01 00:00:00',
            ]);
        }

        // サイズマスターの登録
        foreach ($factory_items[0]['size_masters'] as $value) {
            // データの挿入
            DB::table('sizes')->insert([
                'size_name' => $value,
                'created_at' => '2010-04-01 00:00:00',
                'updated_at' => '2010-04-01 00:00:00',
            ]);
        }

        // 登録された商品をDBから取得
        $items = Item::all();

        foreach ($items as $item) {
            // 商品に紐づく画像を変数に格納
            $item_img = $factory_items[0]['item_image'][$item->product_number];
            // マスターのカラーと一致するものをインスタンスで取得
            $color_instance = Color::select('id')->where('color_name', $item_img['color_name'])->first();
            // 画像保存
            Image::create([
                'item_id' => $item->id,
                'color_id' => $color_instance->id,
                'image' => $item_img['image'],
                'image_category' => 0, // 0: メイン画像, 1: サムネイル画像 * Yahoo商品検索APIではサムネイル画像は取得出来ないのでメインのみ
                'created_at' => !is_null($item->posted_at) ? $item->posted_at : '2010-04-01 00:00:00',
                'updated_at' => !is_null($item->modified_at) ? $item->modified_at : '2010-04-01 00:00:00',
            ]);

            // 商品に紐づく寸法を変数に格納
            $item_measurements = $factory_items[0]['item_measurements'][$item->product_number];

            for ($n = 0; $n < count($item_measurements); $n++) {
                // マスターのサイズと一致するものをインスタンスで取得
                $size_instance = Size::select('id')->where('size_name', $item_measurements[$n])->first();
                // 商品に紐づく寸法を保存
                DB::table('measurements')->insert([
                    'item_id' => $item->id,
                    'size_id' => $size_instance->id,
                    'width' => rand(0, 100),
                    'shoulder_width' => rand(0, 100),
                    'raglan_sleeve_length' => rand(0, 100),
                    'sleeve_length' => rand(0, 100),
                    'length' => rand(0, 100),
                    'waist' => rand(0, 100),
                    'hip' => rand(0, 100),
                    'rise' => rand(0, 100),
                    'inseam' => rand(0, 100),
                    'thigh_width' => rand(0, 100),
                    'outseam' => rand(0, 100),
                    'sk_length' => rand(0, 100),
                    'hem_width' => rand(0, 100),
                    'weight' => rand(0, 100),
                    'created_at' => !is_null($item->posted_at) ? $item->posted_at : '2010-04-01 00:00:00',
                    'updated_at' => !is_null($item->modified_at) ? $item->modified_at : '2010-04-01 00:00:00',
                ]);

                // 商品に紐づくカラーを変数に格納
                $item_colors = $factory_items[0]['item_colors'][$item->product_number];

                for ($t = 0; $t < count($item_colors); $t++) {
                    // マスターのカラーと一致するものをインスタンスで取得
                    $color_instance2 = Color::select('id')->where('color_name', $item_colors[$t])->first();
                    // 商品に紐づくSKUを保存
                    DB::table('skus')->insert([
                        'item_id' => $item->id,
                        'size_id' => $size_instance->id,
                        'color_id' => $color_instance2->id,
                        'quantity' => rand(0, 1000),
                        'created_at' => !is_null($item->posted_at) ? $item->posted_at : '2010-04-01 00:00:00',
                        'updated_at' => !is_null($item->modified_at) ? $item->modified_at : '2010-04-01 00:00:00',
                    ]);
                }
            }

            // 商品に紐づくカテゴリを変数に格納
            $category_item = $factory_items[0]['category_item'][$item->product_number];

            for ($n = 0; $n < count($category_item); $n++) {
                DB::table('category_item')->insert([
                    'item_id' => $item->id,
                    'category_id' => $category_item[$n],
                ]);
            }
        }

        DB::statement('SET FOREIGN_KEY_CHECKS=1;'); // 外部キー制約を有効化
    }
}

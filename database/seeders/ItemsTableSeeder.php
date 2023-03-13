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
        // Yahoo API has limit 30 request per minutes. 
        // Adjust how many items it will get by factory function

        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        DB::table('items')->truncate();
        DB::table('colors')->truncate();
        DB::table('sizes')->truncate();
        DB::table('images')->truncate();
        DB::table('measurements')->truncate();
        DB::table('skus')->truncate();
        DB::table('category_item')->truncate();

        // Convert a collection into an array * make() return collection
        $factory_items = Item::factory()->count(1)->make()->toArray();

        // Appended columns is generated automatically when Eloquent model is serialized
        $appends = ['is_published_text', 'price_text', 'cost_text', 'included_tax_price', 'included_tax_price_text'];

        foreach ($appends as $value) {
            // Delete Appended columns
            unset($factory_items[0][$value]);
        }

        // Register items
        DB::table('items')->insert($factory_items[0]['items']);

        // Delete items which is stored incorrectly in order to prevent data inconsistency
        Item::where('product_number', '')->orWhere('mixture_ratio', '')->orWhere('made_in', '')->delete();

        // Register colors
        foreach ($factory_items[0]['color_masters'] as $value) {
            DB::table('colors')->insert([
                'color_name' => $value,
                'created_at' => '2010-04-01 00:00:00',
                'updated_at' => '2010-04-01 00:00:00',
            ]);
        }

        // Register sizes
        foreach ($factory_items[0]['size_masters'] as $value) {
            DB::table('sizes')->insert([
                'size_name' => $value,
                'created_at' => '2010-04-01 00:00:00',
                'updated_at' => '2010-04-01 00:00:00',
            ]);
        }

        // Get all registered items
        $items = Item::all();

        foreach ($items as $item) {
            // Assign images related with items to variables
            $item_img = $factory_items[0]['item_image'][$item->product_number];
            // Create instance from data which correspond with color name registered in DB
            $color_instance = Color::select('id')->where('color_name', $item_img['color_name'])->first();
            Image::create([
                'item_id' => $item->id,
                'color_id' => $color_instance->id,
                'image' => $item_img['image'],
                'image_category' => config('define.image_category.main'), // 0: main image, * ItemSearch API (Yahoo) can get only one item picture
                'created_at' => !is_null($item->posted_at) ? $item->posted_at : '2010-04-01 00:00:00',
                'updated_at' => !is_null($item->modified_at) ? $item->modified_at : '2010-04-01 00:00:00',
            ]);

            // Assign measurements related with items to variables
            $item_measurements = $factory_items[0]['item_measurements'][$item->product_number];

            for ($n = 0; $n < count($item_measurements); $n++) {
                // Create instance from data which correspond with size name registered in DB
                $size_instance = Size::select('id')->where('size_name', $item_measurements[$n])->first();
                // Register measurement related with items to variables
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

                // Assign colors related with items to variables
                $item_colors = $factory_items[0]['item_colors'][$item->product_number];

                for ($t = 0; $t < count($item_colors); $t++) {
                    // Create instance from data which correspond with color name registered in DB
                    $color_instance2 = Color::select('id')->where('color_name', $item_colors[$t])->first();
                    // Register sku related with items to variables
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

            // Assign categories related with items to variables
            $category_item = $factory_items[0]['category_item'][$item->product_number];

            for ($n = 0; $n < count($category_item); $n++) {
                DB::table('category_item')->insert([
                    'item_id' => $item->id,
                    'category_id' => $category_item[$n],
                ]);
            }
        }

        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
}

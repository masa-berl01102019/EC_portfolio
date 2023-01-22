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
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        DB::table('item_tag')->truncate();

        $items = Item::all();

        $item_tag = [];

        $tags_id = Tag::pluck('id')->all();

        foreach ($items as $item) {

            // Generate an array which stored tag ID from 2 to 6 randomly
            $random_tag_arr = array_rand($tags_id, rand(2, 6));

            for ($n = 0; $n < count($random_tag_arr); $n++) {
                $item_tag[] = [
                    'item_id' => $item->id,
                    'tag_id' => $random_tag_arr[$n],
                ];
            }
        }

        DB::table('item_tag')->insert($item_tag);

        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
}

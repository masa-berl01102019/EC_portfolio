<?php

namespace Database\Seeders;

use App\Models\News;
use App\Models\Tag;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class NewsTagTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        DB::table('news_tag')->truncate();

        $news = News::all();

        $news_tag = [];

        $tags_id = Tag::pluck('id')->all();

        foreach ($news as $item) {

            // Generate an array which stored tag ID from 2 to 6 randomly
            $random_tag_arr = array_rand($tags_id, rand(2, 6));

            for ($n = 0; $n < count($random_tag_arr); $n++) {
                $news_tag[] = [
                    'news_id' => $item->id,
                    'tag_id' => $random_tag_arr[$n],
                ];
            }
        }

        DB::table('news_tag')->insert($news_tag);

        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
}

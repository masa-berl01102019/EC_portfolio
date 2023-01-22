<?php

namespace Database\Seeders;

use App\Models\News;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class NewsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        DB::table('news')->truncate();

        // Convert a collection into an array * make() return collection
        $factory_news = News::factory()->count(1)->make()->toArray();

        // Appended columns is generated automatically when Eloquent model is serialized
        $appends = ['full_name', 'full_name_kana', 'is_published_text', 'gender_category_text'];

        foreach ($appends as $value) {
            // Delete Appended columns
            unset($factory_news[0][$value]);
        }

        DB::table('news')->insert($factory_news[0]);

        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
}

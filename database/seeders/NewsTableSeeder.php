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
        DB::statement('SET FOREIGN_KEY_CHECKS=0;'); // 一時的に外部キー制約を無効化

        DB::table('news')->truncate(); // テーブルごと削除して再構築

        // make()でコレクションが返ってくるので配列に変換
        $factory_news = News::factory()->count(1)->make()->toArray();

        // シリアライズ時に追加されるカラム
        $appends = ['full_name', 'full_name_kana', 'is_published_text', 'gender_category_text'];

        // bulkでinsert時に邪魔なので削除
        foreach ($appends as $value) {
            //削除実行
            unset($factory_news[0][$value]);
        }

        DB::table('news')->insert($factory_news[0]); // データの挿入

        DB::statement('SET FOREIGN_KEY_CHECKS=1;'); // 外部キー制約を有効化
    }
}

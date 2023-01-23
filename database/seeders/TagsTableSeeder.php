<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TagsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;'); // 一時的に外部キー制約を無効化

        DB::table('tags')->truncate(); // テーブルごと削除して再構築

        $tags = [
            'Holiday Look', 'Rainy Day Outfits', 'Outdoor', 'Elegance', 'Casual', 'Collaborate with ◯◯ Brand', 'High-functional material', 'Quick-drying',
            'UV protection', 'Vintage', '◯◯ fashion magazines', 'Cosy Fashion', 'Stylist Selection', '23SS LOOK', 'Import products', 'Date Outfits', 'Classic', 'Mode Fashion', 'Tokyo collection', 'Quantity Limited', 'WEB Limited', 'Sale'
        ];

        foreach ($tags as $value) {
            // データの挿入
            DB::table('tags')->insert([
                'tag_name' => $value,
                'created_at' => '2010-04-01 00:00:00',
                'updated_at' => '2010-04-01 00:00:00',
            ]);
        }

        DB::statement('SET FOREIGN_KEY_CHECKS=1;'); // 外部キー制約を有効化
    }
}

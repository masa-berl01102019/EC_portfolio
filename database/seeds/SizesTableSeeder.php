<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SizesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;'); // 一時的に外部キー制約を無効化

        DB::table('sizes')->truncate(); // テーブルごと削除して再構築

        DB::table('sizes')->insert([
            [
                'size_name' => 'S',
                'created_at' => '2010-04-01 00:00:00',
                'updated_at' => '2010-04-01 00:00:00',
            ],
            [
                'size_name' => 'M',
                'created_at' => '2010-04-01 00:00:00',
                'updated_at' => '2010-04-01 00:00:00',
            ],
            [
                'size_name' => 'L',
                'created_at' => '2010-04-01 00:00:00',
                'updated_at' => '2010-04-01 00:00:00',
            ]
        ]);

        DB::statement('SET FOREIGN_KEY_CHECKS=1;'); // 外部キー制約を有効化
    }
}

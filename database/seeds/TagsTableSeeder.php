<?php

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

        $tags = ['休日コーデ', '雨の日コーデ', 'アウトドア', 'キレイめ', 'カジュアル', '◯◯ブランドコラボ企画', 'アスレチック', '機能性素材', '吸水速乾',
                 'UVカット', '形状記憶', '雑誌掲載', '簡単着回し', 'スタイリストコラボ', '今季イチオシ素材', 'インポート', 'デートにぴったり', '定番商品',
                 'モード', '製品染め', '東京コレクション', '数量限定', 'web限定', 'セール商品'];

        foreach($tags as $value) {
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

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

        $tags = ['休日コーデ', '雨の日コーデ', 'アウトドア', 'キレイめ', 'カジュアル', 'コラボ企画', 'アスレチック', 'サテン', 'ジョーゼット', 'バックサテン', 'ツイル', '吸水速乾', 'UVカット',
                'ドレープ素材', '形状記憶', 'ビビットカラー', '雑誌掲載', 'ジョガーパンツ', 'ラップスカート', 'ミモレ丈', 'オックス', '岡山デニム', 'ビックシルエット', '麻', 'シャンブレー',
                '開襟シャツ', 'メリノウール', '製品染め', 'ミラノリブ', 'ガウチョパンツ', 'オフショル', '東京コレクション'];

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

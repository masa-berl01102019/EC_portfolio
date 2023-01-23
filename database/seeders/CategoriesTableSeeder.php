<?php

namespace Database\Seeders;

use SplFileObject;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategoriesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;'); // 一時的に外部キー制約を無効化

        DB::table('categories')->truncate(); // テーブルごと削除して再構築

        $file = new SplFileObject('database/csv/categories_demo_en.csv'); // SplFileObject(phpのファイル操作のためのクラス) でインスタンス作成

        $file->setFlags( // flagの設定
            \SplFileObject::READ_CSV | // CSV 列として行を読み込む
                \SplFileObject::READ_AHEAD | // 先読み/巻き戻しで読み出す
                \SplFileObject::SKIP_EMPTY | // 空行は読み飛ばす
                \SplFileObject::DROP_NEW_LINE // 行末の改行を読み飛ばす
        );

        $list = []; // 配列の初期化

        $row_count = 1;

        foreach ($file as $line) {
            if ($row_count > 1) { // 最初の一行目(headerの列)を読み込まないよう条件分岐
                $list[] = [
                    'id' => $line[0],
                    'category_name' => $line[1],
                    'parent_id' => $line[2],
                    'created_at' => '2010-04-01 00:00:00',
                    'updated_at' => '2010-04-01 00:00:00',
                ];
                // 取得した値をカラム名ごとに代入
            }
            $row_count++;
        }

        DB::table('categories')->insert($list); // データの挿入

        DB::statement('SET FOREIGN_KEY_CHECKS=1;'); // 外部キー制約を有効化
    }
}

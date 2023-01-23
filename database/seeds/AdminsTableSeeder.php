<?php

use App\Models\Admin;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AdminsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;'); // 一時的に外部キー制約を無効化

        DB::table('admins')->truncate(); // テーブルごと削除して再構築

        factory(Admin::class, 10)->create();

        DB::statement('SET FOREIGN_KEY_CHECKS=1;'); // 外部キー制約を有効化
    }
}

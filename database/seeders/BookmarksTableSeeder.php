<?php

namespace Database\Seeders;

use App\Models\Bookmark;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BookmarksTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        DB::table('bookmarks')->truncate();

        Bookmark::factory(1000)->create();

        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
}

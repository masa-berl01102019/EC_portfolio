<?php

namespace Database\Seeders;

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
        DB::statement('SET FOREIGN_KEY_CHECKS=0;'); // Inactivate foreign key temporary

        DB::table('admins')->truncate();

        Admin::factory(10)->create();

        DB::statement('SET FOREIGN_KEY_CHECKS=1;'); // Activate a foreign key
    }
}

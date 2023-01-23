<?php

namespace Database\Seeders;

use Carbon\Carbon;
use App\Models\Admin;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

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

        // TEST ADMIN
        DB::table('admins')->insert([
            [
                'last_name' => 'TEST',
                'first_name' => 'ADMIN',
                'last_name_kana' => '',
                'first_name_kana' => '',
                'tel' => '090-1234-5678',
                'email' => 'admin@test.com',
                'password' => Hash::make('abc12345'),
                'email_verified_at' => new Carbon('2015-07-07 11:30'),
                'created_at' => new Carbon('2015-07-07 11:30'),
                'updated_at' => new Carbon('2015-07-07 11:30'),
            ]
        ]);

        Admin::factory(10)->create();

        DB::statement('SET FOREIGN_KEY_CHECKS=1;'); // Activate a foreign key
    }
}

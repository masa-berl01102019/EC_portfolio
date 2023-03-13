<?php

namespace Database\Seeders;

use Carbon\Carbon;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        DB::table('users')->truncate();

        // TEST USER
        DB::table('users')->insert([
            [
                'last_name' => 'TEST',
                'first_name' => 'USER',
                'last_name_kana' => '',
                'first_name_kana' => '',
                'gender' => config('define.gender.man'),
                'birthday' => '1988-05-01',
                'post_code' => 5771819,
                'prefecture' => '大阪府',
                'municipality' => '田辺市',
                'street_name' => '山田町',
                'street_number' => '1-1-1',
                'building' => null,
                'delivery_post_code' => null,
                'delivery_prefecture' => null,
                'delivery_municipality' => null,
                'delivery_street_name' => null,
                'delivery_street_number' => null,
                'delivery_building' => null,
                'tel' => '090-1234-5678',
                'email' => 'user@test.com',
                'password' => Hash::make('abc12345'),
                'is_received' => config('define.is_received.registered'),
                'email_verified_at' => new Carbon('2015-07-07 11:30'),
                'created_at' => new Carbon('2015-07-07 11:30'),
                'updated_at' => new Carbon('2015-07-07 11:30'),
            ]
        ]);

        User::factory(1000)->create();

        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
}

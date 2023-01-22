<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TaxSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        DB::table('taxes')->truncate();

        DB::table('taxes')->insert([
            [
                'percentage' => 3,
                'from'       => '1989-04-01 00:00:00',
                'to'         => '1997-03-31 23:59:59',
            ],
            [
                'percentage' => 5,
                'from'       => '1997-04-01 00:00:00',
                'to'         => '2014-03-31 23:59:59',
            ],
            [
                'percentage' => 8,
                'from'       => '2014-04-01 00:00:00',
                'to'         => '2019-09-30 23:59:59',
            ],
            [
                'percentage' => 10,
                'from'       => '2019-10-01 00:00:00',
                'to'         => '2030-12-31 23:59:59',
            ]
        ]);

        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
}

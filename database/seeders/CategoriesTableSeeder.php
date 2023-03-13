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
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        DB::table('categories')->truncate();

        // Create SplFileObject instance
        $file = new SplFileObject('database/csv/categories_demo_en.csv');

        $file->setFlags( // set flag
            \SplFileObject::READ_CSV | // Read lines as CSV rows.
                \SplFileObject::READ_AHEAD | // Read on rewind/next.
                \SplFileObject::SKIP_EMPTY | // Skips empty lines in the file. * This requires the READ_AHEAD flag be enabled, to work as expected.
                \SplFileObject::DROP_NEW_LINE // Drop newlines at the end of a line.
        );

        $list = [];
        $row_count = 1;

        foreach ($file as $line) {
            if ($row_count > 1) { // Skips the first lines in the file. It will be a header.
                $list[] = [
                    'id' => $line[0],
                    'category_name' => $line[1],
                    'category_type' => $line[2], // 1: gender / 2: main / 3: sub
                    'parent_id' => $line[3],
                    'created_at' => '2010-04-01 00:00:00',
                    'updated_at' => '2010-04-01 00:00:00',
                ];
                // Assign value to array by column name
            }
            $row_count++;
        }

        DB::table('categories')->insert($list);

        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
}

<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
         $this->call([
             UsersTableSeeder::class,
             AdminsTableSeeder::class,
             BrandsTableSeeder::class,
             TagsTableSeeder::class,
             ContactsTableSeeder::class,
             NotificationsTableSeeder::class,
             NewsTableSeeder::class,
             BlogsTableSeeder::class,
             ItemsTableSeeder::class,
             ImagesTableSeeder::class,
             CategoriesTableSeeder::class,
             CategoryItemTableSeeder::class,
             ColorsTableSeeder::class,
             SizesTableSeeder::class,
             MeasurementsTableSeeder::class,
             SkusTableSeeder::class,
             CartsTableSeeder::class,
             BookmarksTableSeeder::class,
             OrderDetailsTableSeeder::class,
             OrdersTableSeeder::class,
             ItemTagTableSeeder::class,
         ]);
    }
}

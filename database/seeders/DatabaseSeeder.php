<?php
namespace Database\Seeders;

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
             CategoriesTableSeeder::class,
             NotificationsTableSeeder::class,
             ContactsTableSeeder::class,
             NewsTableSeeder::class,
             BlogsTableSeeder::class,
             ItemsTableSeeder::class,
             ColorsTableSeeder::class,
             SizesTableSeeder::class,
             ImagesTableSeeder::class,
             MeasurementsTableSeeder::class,
             SkusTableSeeder::class,
             CartsTableSeeder::class,
             BookmarksTableSeeder::class,
             OrderDetailsTableSeeder::class,
             OrdersTableSeeder::class,
             ItemTagTableSeeder::class,
             CategoryItemTableSeeder::class,
             BlogTagTableSeeder::class,
             BlogItemTableSeeder::class,
             NewsTagTableSeeder::class
         ]);
    }
}

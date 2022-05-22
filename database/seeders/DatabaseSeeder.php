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
            //  UsersTableSeeder::class,
            //  AdminsTableSeeder::class,
            //  BrandsTableSeeder::class,
            //  TagsTableSeeder::class,
            //  CategoriesTableSeeder::class,
            //  NotificationsTableSeeder::class,
            //  ContactsTableSeeder::class,
            //  NewsTableSeeder::class,
            //  BlogsTableSeeder::class,
            //  TaxSeeder::class,
            //  BlogTagTableSeeder::class,
            //  NewsTagTableSeeder::class,
            //  ItemsTableSeeder::class,
            //  ColorsTableSeeder::class,
            //  SizesTableSeeder::class,
            //  ImagesTableSeeder::class,
            //  MeasurementsTableSeeder::class,
            //  SkusTableSeeder::class,
            //  ItemTagTableSeeder::class,
            //  CategoryItemTableSeeder::class,
            //  BlogItemTableSeeder::class,
             CartsTableSeeder::class,
             BookmarksTableSeeder::class,
             OrdersTableSeeder::class
         ]);
    }
}

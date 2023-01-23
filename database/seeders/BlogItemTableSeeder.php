<?php

namespace Database\Seeders;

use App\Models\Blog;
use App\Models\Item;
use App\Models\Brand;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BlogItemTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        DB::table('blog_item')->truncate();

        $blogs = Blog::all();

        $blog_item = [];

        foreach ($blogs as $blog) {

            $items_id = Item::where('brand_id', $blog->brand_id)->whereHas('categories', function ($query) use ($blog) {
                $query->where('categories.id', '=',  $blog->category_id);
            })->pluck('id')->toArray();

            if (!empty($items_id) && is_array($items_id)) {
                shuffle($items_id);
                for ($n = 0; $n < count($items_id); $n++) {
                    if ($n > 3) break;
                    $blog_item[] = [
                        'blog_id' => $blog->id,
                        'item_id' => $items_id[$n],
                    ];
                }
            }
        }

        DB::table('blog_item')->insert($blog_item);

        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
}

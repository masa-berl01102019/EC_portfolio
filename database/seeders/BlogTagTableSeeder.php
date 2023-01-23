<?php

namespace Database\Seeders;

use App\Models\Blog;
use App\Models\Tag;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BlogTagTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        DB::table('blog_tag')->truncate();

        $blogs = Blog::all();

        $blog_tag = [];

        $tags_id = Tag::pluck('id')->all();

        foreach ($blogs as $blog) {

            // Generate an array which stored tag ID from 2 to 6 randomly
            $random_tag_arr = array_rand($tags_id, rand(2, 6));

            for ($n = 0; $n < count($random_tag_arr); $n++) {
                $blog_tag[] = [
                    'blog_id' => $blog->id,
                    'tag_id' => $random_tag_arr[$n],
                ];
            }
        }

        DB::table('blog_tag')->insert($blog_tag);

        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
}

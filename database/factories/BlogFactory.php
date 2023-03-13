<?php

namespace Database\Factories;

use App\Models\Blog;
use App\Models\Admin;
use App\Models\Brand;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\Factories\Factory;

class BlogFactory extends Factory
{
    protected $model = Blog::class;

    public function definition()
    {
        $arr = [];
        // Get demo data
        $blog_men_imges = Storage::allFiles('public/img/demo/blog_men');
        $blog_women_imges = Storage::allFiles('public/img/demo/blog_women');

        foreach ($blog_men_imges as $image) {
            // Extract a file name from path
            $file_name = str_replace('public/img/demo/blog_men/', '', $image);
            // Change path because it has to be '/storage/img/file name' in order to call from front-side
            $db_reserve_path = '/storage/img/demo/blog_men/' . $file_name;
            // Add data to an array
            $arr[] = $this->createDemo($db_reserve_path, 'men');
        }

        foreach ($blog_women_imges as $image) {
            // Extract a file name from path
            $file_name = str_replace('public/img/demo/blog_women/', '', $image);
            // Change path because it has to be '/storage/img/file name' in order to call from front-side
            $db_reserve_path = '/storage/img/demo/blog_women/' . $file_name;
            // Add data to an array
            $arr[] = $this->createDemo($db_reserve_path, 'women');
        }

        return $arr;
    }

    /**
     * Create demo data function
     * @param string $image URL
     * @param string $gender men:1 / women:2
     */
    public function createDemo($image, $gender)
    {
        // Get the instance of admin randomly
        $admin = Admin::inRandomOrder()->first();

        // Get the instance of brand randomly
        $brand = Brand::inRandomOrder()->first();

        $category_id = config('define.gender_category')[$gender];

        // Publish at 80 %
        $is_published = $this->faker->optional($weight = 0.2, $default = 1)->numberBetween($min = 0, $max = 1); // 0: Unpublished 1: Published

        $posted_at = $this->faker->dateTimeBetween($startDate = '-10 years', $endDate = 'now', $timezone = null);

        $modified_at = $this->faker->dateTimeBetween($startDate = $posted_at, $endDate = 'now', $timezone = null);

        return [
            'brand_id' => $brand->id,
            'admin_id' => $admin->id,
            'category_id' => $category_id,
            'title' => $this->faker->text($maxNbChars = 20),
            // 'body' => $this->faker->randomHtml(4, 4),
            'body' => '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Document</title></head><body><h1>Delectus eveniet.</h1><p>Aliquam reprehenderit aliquam nemo.</p><p>Reprehenderit.</p><p>Repellat.</p><p>Laudantium velit ad.</p><p>Facilis et architecto consectetur aliquid in facere.</p><p>Dolores.</p><p>Similique cumque iste doloribus reiciendis pariatur dignissimos est sit occaecati ea ea fuga.</p><p>Aut commodi consequatur quis.</p><p>Animi praesentium.</p><p>Id voluptatem culpa sed.</p><p>Maxime est quia officia perferendis voluptatem vel iure sunt.</p><p>Omnis temporibus enim temporibus id.</p><p>Explicabo amet error sit.</p><p>Vero officia aperiam in et velit id.</p><p>Id quis aut id sit.</p><p>Totam molestias omnis soluta consectetur id ipsum quos.</p><p>Mollitia modi qui nisi odit dolor itaque.</p><p>Quia est repellendus.</p><p>Qui voluptatem accusamus ut dolorem nulla ad.</p><p>Ipsum nam eligendi sed minus non neque perspiciatis adipisci rerum architecto.</p><p>Reprehenderit et explicabo.</p><p>Quaerat facilis non unde quos quis placeat cum assumenda omnis.</p></body></html>',
            // 'thumbnail' => $this->faker->imageUrl($width = 640, $height = 480, $category = 'BLOG', $randomize = true),
            'thumbnail' => $image,
            'is_published' => $is_published,
            'posted_at' => $is_published === config('define.is_published.open') ? $posted_at : null,
            'modified_at' => $is_published === config('define.is_published.open') ? $modified_at : null,
        ];
    }
}

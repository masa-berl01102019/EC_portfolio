<?php

namespace Database\Factories;

use App\Models\News;
use App\Models\Admin;
use App\Models\Brand;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\Factories\Factory;

class NewsFactory extends Factory
{
    protected $model = News::class;

    public function definition()
    {
        $arr = [];
        // Get demo data
        $news_men_imges = Storage::allFiles('public/img/demo/news_men');
        $news_women_imges = Storage::allFiles('public/img/demo/news_women');

        foreach ($news_men_imges as $image) {
            // Extract a file name from path
            $file_name = str_replace('public/img/demo/news_men/', '', $image);
            // Change path because it has to be '/storage/img/file name' in order to call from front-side
            $db_reserve_path = '/storage/img/demo/news_men/' . $file_name;
            // Add data to an array
            $arr[] = $this->createDemo($db_reserve_path, 'men');
        }

        foreach ($news_women_imges as $image) {
            // Extract a file name from path
            $file_name = str_replace('public/img/demo/news_women/', '', $image);
            // Change path because it has to be '/storage/img/file name' in order to call from front-side
            $db_reserve_path = '/storage/img/demo/news_women/' . $file_name;
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
            'body' => $this->faker->randomHtml(4, 4),
            // 'thumbnail' => $this->faker->imageUrl($width = 640, $height = 480, $category='NEWS', $randomize = true),
            'thumbnail' => $image,
            'is_published' => $is_published,
            'posted_at' => $is_published === 1 ? $posted_at : null,
            'modified_at' => $is_published === 1 ? $modified_at : null,
        ];
    }
}

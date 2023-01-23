<?php

namespace Database\Factories;

use App\Models\Admin;
use App\Models\Blog;
use App\Models\Brand;
use Illuminate\Database\Eloquent\Factories\Factory;

class BlogFactory extends Factory
{
    protected $model = Blog::class;

    public function definition()
    {
        // 管理者IDをすべて配列で取得
        $admins_id = Admin::pluck('id')->all();

        // ランダムで管理者IDを一つ取り出し
        $admin_id = $this->faker->randomElement($admins_id);

        // ブランドIDをすべて配列で取得
        $brands_id = Brand::pluck('id')->all();

        // ランダムでブランドIDを一つ取り出し
        $brand_id = $this->faker->randomElement($brands_id);

        // カテゴリIDを配列で用意 1:メンズ 2:レディース
        $categories_id = [1,2];

        // ランダムでカテゴリIDを一つ取り出し
        $category_id = $this->faker->randomElement($categories_id);

        // 公開状況
        $is_published = $this->faker->numberBetween($min = 0, $max = 1); // 0: 未公開　1: 公開

        // 公開日
        $posted_at = $this->faker->dateTimeBetween($startDate = '-10 years', $endDate = 'now', $timezone = null);

        // 更新日
        $modified_at = $this->faker->dateTimeBetween($startDate = $posted_at, $endDate = 'now', $timezone = null);

        return [
            'brand_id' => $brand_id,
            'admin_id' => $admin_id,
            'category_id' => $category_id,
            'title' => $this->faker->text($maxNbChars = 20),
            'body' => $this->faker->randomHtml(2, 3),
            'thumbnail' => $this->faker->imageUrl($width = 640, $height = 480),
            'is_published' => $is_published,
            'posted_at' => $is_published === 1? $posted_at: null,
            'modified_at' => $is_published === 1? $modified_at: null,
        ];
    }
}

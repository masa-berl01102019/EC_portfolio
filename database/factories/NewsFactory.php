<?php

namespace Database\Factories;

use App\Models\Admin;
use App\Models\Brand;
use App\Models\News;
use Illuminate\Database\Eloquent\Factories\Factory;

class NewsFactory extends Factory
{
    protected $model = News::class;

    public function definition()
    {
        // ランダムに管理者インスタンスを取得
        $admin = Admin::inRandomOrder()->first();

        // ランダムにブランドのインスタンスを取得
        $brand = Brand::inRandomOrder()->first();

        // カテゴリID (1:メンズ 2:レディース) をランダムに一つ取り出し格納
        $category_id = $this->faker->randomElement([1,2]);

        // 公開状況 * 80%の確率で公開
        $is_published = $this->faker->optional($weight = 0.2, $default = 1)->numberBetween($min = 0, $max = 1); // 0: 未公開 1: 公開

        // 投稿日
        $posted_at = $this->faker->dateTimeBetween($startDate = '-10 years', $endDate = 'now', $timezone = null);

        // 更新日
        $modified_at = $this->faker->dateTimeBetween($startDate = $posted_at, $endDate = 'now', $timezone = null);

        return [
            'brand_id' => $brand->id,
            'admin_id' => $admin->id,
            'category_id' => $category_id,
            'title' => $this->faker->text($maxNbChars = 20),
            'body' => $this->faker->randomHtml(2, 3),
            'thumbnail' => $this->faker->imageUrl($width = 640, $height = 480, $category='NEWS', $randomize = true),
            'is_published' => $is_published,
            'posted_at' => $is_published === 1? $posted_at: null,
            'modified_at' => $is_published === 1? $modified_at: null,
        ];
    }
}
<?php
namespace Database\Factories;

use App\Models\Admin;
use App\Models\Notification;
use Illuminate\Database\Eloquent\Factories\Factory;

class NotificationFactory extends Factory
{
    protected $model = Notification::class;

    public function definition()
    {
        // ランダムに管理者インスタンスを取得
        $admin = Admin::inRandomOrder()->first();

        // 公開状況 60%の確率で公開
        $is_published = $this->faker->optional($weight = 0.4, $default = 1)->numberBetween($min = 0, $max = 1); // 0: 未公開 1: 公開

        // 公開日
        $posted_at = $this->faker->dateTimeBetween($startDate = '-10 years', $endDate = 'now', $timezone = null);

        // 更新日
        $modified_at = $this->faker->dateTimeBetween($startDate = $posted_at, $endDate = 'now', $timezone = null);

        // 有効期限
        $expired_at = $this->faker->dateTimeBetween($startDate = $modified_at, $endDate = '+12 week', $timezone = null);

        return [
            'admin_id' => $admin->id,
            'title' => $this->faker->text($maxNbChars = 20),
            'body' => $this->faker->text($maxNbChars = 200),
            'is_published' => $is_published,
            'expired_at' => $is_published === 1? $expired_at: null,
            'posted_at' => $is_published === 1? $posted_at: null,
            'modified_at' => $is_published === 1? $modified_at: null,
        ];
    }
}

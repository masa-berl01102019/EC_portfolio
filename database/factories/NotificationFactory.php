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
        // 管理者IDをすべて配列で取得
        $admins_id = Admin::pluck('id')->all();

        // ランダムで管理者IDを一つ取り出し
        $admin_id = $this->faker->randomElement($admins_id);

        // 公開状況
        $is_published = $this->faker->numberBetween($min = 0, $max = 1); // 0: 未公開　1: 公開

        // 公開日
        $posted_at = $this->faker->dateTimeBetween($startDate = '-10 years', $endDate = 'now', $timezone = null);

        // 更新日
        $modified_at = $this->faker->dateTimeBetween($startDate = $posted_at, $endDate = 'now', $timezone = null);

        // 有効期限
        $expired_at = $this->faker->dateTimeBetween($startDate = $modified_at, $endDate = 'now', $timezone = null);

        return [
            'admin_id' => $admin_id,
            'title' => $this->faker->realText(20),
            'body' => $this->faker->realText(200),
            'is_published' => $is_published,
            'expired_at' => $is_published === 1? $expired_at: null,
            'posted_at' => $is_published === 1? $posted_at: null,
            'modified_at' => $is_published === 1? $modified_at: null,
        ];
    }
}

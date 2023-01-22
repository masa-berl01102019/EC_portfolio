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
        // Get the instance of admin randomly
        $admin = Admin::inRandomOrder()->first();

        // Publish at 60%
        $is_published = $this->faker->optional($weight = 0.4, $default = 1)->numberBetween($min = 0, $max = 1); // 0: Unpublished 1: Published

        $posted_at = $this->faker->dateTimeBetween($startDate = '-10 years', $endDate = 'now', $timezone = null);

        $modified_at = $this->faker->dateTimeBetween($startDate = $posted_at, $endDate = 'now', $timezone = null);

        $expired_at = $this->faker->dateTimeBetween($startDate = $modified_at, $endDate = '+12 week', $timezone = null);

        return [
            'admin_id' => $admin->id,
            'title' => $this->faker->text($maxNbChars = 20),
            'body' => $this->faker->text($maxNbChars = 200),
            'is_published' => $is_published,
            'expired_at' => $is_published === 1 ? $expired_at : null,
            'posted_at' => $is_published === 1 ? $posted_at : null,
            'modified_at' => $is_published === 1 ? $modified_at : null,
        ];
    }
}

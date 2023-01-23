<?php

namespace App\Models;

use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Notifications\Notifiable;

class Admin extends Authenticatable
{
    use Notifiable; // 通知(使うか未定)
    use SoftDeletes; //　論理削除

    /** シリアライズ */

    // 編集不可カラム
    protected $guarded = [
        'id'
    ];

    // モデルからシリアライズ時に非表示にするカラムの設定
    protected $hidden = [
        'password', 'remember_token',
    ];

    // モデルからシリアライズ時の日付形式の設定
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    /** リレーション */

    public function news() {
        return $this->hasMany('App\Models\News');
    }

    public function blogs() {
        return $this->hasMany('App\Models\Blog');
    }

    public function items() {
        return $this->hasMany('App\Models\Item');
    }

    public function notifications() {
        return $this->hasMany('App\Models\Notification');
    }


}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Notifications\Notifiable;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
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
        'birthday' => 'date:Y-m-d',
        'email_verified_at' => 'datetime',
    ];

    /** リレーション */

    public function bookmarks() {
        return $this->hasMany('App\Models\Bookmark');
    }

    public function carts() {
        return $this->hasMany('App\Models\Cart');
    }

    public function contacts() {
        return $this->hasMany('App\Models\Contact');
    }

    public function orders() {
        return $this->hasMany('App\Models\Order');
    }

}

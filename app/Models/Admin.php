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
        'created_at' => 'date:Y-m-d H:m',
        'updated_at' => 'date:Y-m-d H:m',
        'email_verified_at' => 'datetime',
    ];

    // 日時データをCarbonインタンスへ自動変換するカラム名を指定
    protected $dates = [
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    /** アクセサ */

    // 関数の返却値を独自の属性(カラム名)として設定
    public function getFullNameAttribute() {
        return $this->last_name . ' ' . $this->first_name;
    }
    public function getFullNameKanaAttribute() {
        return $this->last_name_kana . ' ' . $this->first_name_kana;
    }

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

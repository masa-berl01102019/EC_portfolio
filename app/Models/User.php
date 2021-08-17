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

    // 配列内に含めたい独自の属性(カラム名)を定義
    protected $appends = ['ac_post_code', 'ac_delivery_post_code', 'ac_gender', 'ac_is_received'];

    // 関数の返却値を独自の属性(カラム名)として設定
    public function getFullNameAttribute() {
        return $this->last_name . ' ' . $this->first_name;
    }
    public function getFullNameKanaAttribute() {
        return $this->last_name_kana . ' ' . $this->first_name_kana;
    }
    public function getFullAddressAttribute() {
        return $this->prefecture . $this->municipality . $this->street_name . $this->street_number . $this->building;
    }
    public function getFullDeliveryAddressAttribute() {
        return $this->delivery_prefecture . $this->delivery_municipality . $this->delivery_street_name . $this->delivery_street_number . $this->delivery_building;
    }
    public function getAcPostCodeAttribute() {
        return !empty($this->post_code)? '〒'. substr_replace($this->post_code, "-", 3, 0): '';
    }
    public function getAcDeliveryPostCodeAttribute() {
        return !empty($this->delivery_post_code)? '〒'. substr_replace($this->delivery_post_code, "-", 3, 0): '';
    }
    public function getAcGenderAttribute() {
        return isset($this->gender) ? config('define.gender')[$this->gender]: '';
    }
    public function getAcIsReceivedAttribute() {
        return isset($this->is_received) ? config('define.is_received')[$this->is_received]: '';
    }

    // モデルからシリアライズ時の日付形式の設定
    protected $casts = [
        'birthday' => 'date:Y-m-d',
        'created_at' => 'date:Y-m-d H:m',
        'updated_at' => 'date:Y-m-d H:m',
        'email_verified_at' => 'datetime',
    ];

    // 日時データをCarbonインタンスへ自動変換するカラム名を指定
    protected $dates = [
        'created_at',
        'updated_at',
        'deleted_at',
        'birthday',
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

<?php

namespace App\Models;

use App\Traits\AccessorNameTrait;
use App\Traits\TimestampCastTrait;
use App\Traits\OrderByNameScopeTrait;
use App\Traits\FilterKeywordScopeTrait;
use App\Traits\CustomPaginateScopeTrait;
use Illuminate\Notifications\Notifiable;
use App\Traits\FilterDateRangeScopeTrait;
use App\Traits\OrderByCreatedAtScopeTrait;
use App\Traits\OrderByUpdatedAtScopeTrait;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use HasFactory; // laravel8 factory関数使用する為
    use Notifiable; // 通知(使うか未定)
    use SoftDeletes; // 論理削除
    use AccessorNameTrait;
    use OrderByNameScopeTrait;
    use OrderByCreatedAtScopeTrait;
    use OrderByUpdatedAtScopeTrait;
    use FilterKeywordScopeTrait;
    use FilterDateRangeScopeTrait;
    use TimestampCastTrait;
    use CustomPaginateScopeTrait;

    /** シリアライズ */

    // 編集不可カラム
    protected $guarded = [
        'id'
    ];

    // モデルからシリアライズ時に非表示にするカラムの設定
    protected $hidden = [
        'password', 'remember_token',
    ];

    // モデルからシリアライズ時の日付形式の設定 Datetime型用
    protected $casts = [
        'birthday' => 'date:Y/m/d'
    ];

    /** アクセサ */

    // 配列内に含めたい独自の属性(カラム名)を定義
    protected $appends = ['post_code_text', 'delivery_post_code_text', 'full_delivery_address', 'full_address', 'gender_text', 'is_received_text', 'full_name', 'full_name_kana' ];

    // 関数の返却値を独自の属性(カラム名)として設定
    public function getGenderTextAttribute() {
        return isset($this->gender) ? config('define.gender')[$this->gender]: '';
    }

    public function getIsReceivedTextAttribute() {
        return isset($this->is_received) ? config('define.is_received')[$this->is_received]: '';
    }

    public function getFullAddressAttribute() {
        return $this->prefecture . $this->municipality . $this->street_name . $this->street_number . $this->building;
    }

    public function getFullDeliveryAddressAttribute() {
        return $this->delivery_prefecture . $this->delivery_municipality . $this->delivery_street_name . $this->delivery_street_number . $this->delivery_building;
    }

    public function getPostCodeTextAttribute() {
        return !empty($this->post_code)? '〒'. substr_replace($this->post_code, "-", 3, 0): '';
    }

    public function getDeliveryPostCodeTextAttribute() {
        return !empty($this->delivery_post_code)? '〒'. substr_replace($this->delivery_post_code, "-", 3, 0): '';
    }

    /** スコープ */

    public function scopeFilterGender($query, $request) {
        $filter = $request->input('f_gender');
        $flag = $filter !== null ? true : false;
        $query->when($flag, function($query) use($filter) {
            // カンマ区切りで配列に変換
            $gender_arr = explode(',',$filter);
            // 配列内に該当する項目を絞り込み検索
            return $query->whereIn('gender', $gender_arr);
        });
    }

    public function scopeFilterIsReceived($query, $request) {
        $filter = $request->input('f_is_received');
        $flag = $filter !== null ? true : false;
        $query->when($flag, function($query) use($filter) {
            // カンマ区切りで配列に変換
            $receiver_arr = explode(',',$filter);
            // 配列内に該当する項目を絞り込み検索
            return $query->whereIn('is_received', $receiver_arr);
        });
    }

    public function scopeOrderByBirthday($query, $request) {
        $sort = $request->input('birthday');
        $query->when($sort, function($query, $sort) {
            return $query->orderBy('birthday', $sort);
        });
    }

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

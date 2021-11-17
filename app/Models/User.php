<?php

namespace App\Models;

use App\Traits\AddressAccessorTrait;
use App\Traits\FilterDateRangeScopeTrait;
use App\Traits\FilterGenderScopeTrait;
use App\Traits\FilterIsReceivedScopeTrait;
use App\Traits\FilterKeywordScopeTrait;
use App\Traits\NameAccessorTrait;
use App\Traits\OrderByBirthdayScopeTrait;
use App\Traits\OrderByCreatedAtScopeTrait;
use App\Traits\OrderByNameScopeTrait;
use App\Traits\OrderByUpdatedAtScopeTrait;
use DateTimeInterface;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Notifications\Notifiable;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Support\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class User extends Authenticatable
{
    use HasFactory; // laravel8 factory関数使用する為
    use Notifiable; // 通知(使うか未定)
    use SoftDeletes; //　論理削除
    use NameAccessorTrait;
    use AddressAccessorTrait;
    use OrderByNameScopeTrait;
    use OrderByBirthdayScopeTrait;
    use OrderByCreatedAtScopeTrait;
    use OrderByUpdatedAtScopeTrait;
    use FilterIsReceivedScopeTrait;
    use FilterGenderScopeTrait;
    use FilterKeywordScopeTrait;
    use FilterDateRangeScopeTrait;

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
        'birthday' => 'date:Y-m-d'
    ];

    // timestamp型はconfig.phpのlocaleに依存しているので
    //　DB保存時はセットされてるlocaleのタイムゾーンを確認してUTCに変換してDBにinsertするがselect時にはタイムゾーンを確認してセットされたタイムゾーンで表示される
    // JSON形式にシリアライズする際はタイムゾーンを考慮しないでUTCの時間でシリアライズされるので時間がずれてしまう
    // その為、serializeDate()をオーバーライドしてシリアライズ時にタイムゾーンをセットして日付文字列に変換する必要がある
    protected function serializeDate(DateTimeInterface $date)
    {
       return Carbon::instance($date)->tz('Asia/Tokyo')->format('Y-m-d H:i');
    }

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

<?php

namespace App\Models;

use App\Traits\FilterDateRangeScopeTrait;
use App\Traits\FilterKeywordScopeTrait;
use App\Traits\NameAccessorTrait;
use App\Traits\OrderByCreatedAtScopeTrait;
use App\Traits\OrderByNameScopeTrait;
use App\Traits\OrderByUpdatedAtScopeTrait;
use DateTimeInterface;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;

class Admin extends Authenticatable
{
    use Notifiable; // 通知(使うか未定)
    use SoftDeletes; //　論理削除
    use NameAccessorTrait;
    use OrderByNameScopeTrait;
    use OrderByCreatedAtScopeTrait;
    use OrderByUpdatedAtScopeTrait;
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
    protected $appends = ['full_name', 'full_name_kana'];

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

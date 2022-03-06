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

class Admin extends Authenticatable
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

    public function contacts() {
        return $this->hasMany('App\Models\Contact');
    }


}

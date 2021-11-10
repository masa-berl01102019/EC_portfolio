<?php

namespace App\Models;

use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;

class Sku extends Model
{
    use SoftDeletes; //　論理削除

    /** シリアライズ */

    // 編集不可カラム
    protected $guarded = [
        'id'
    ];

    // timestamp型はconfig.phpのlocaleに依存しているので
    //　DB保存時はセットされてるlocaleのタイムゾーンを確認してUTCに変換してDBにinsertするがselect時にはタイムゾーンを確認してセットされたタイムゾーンで表示される
    // JSON形式にシリアライズする際はタイムゾーンを考慮しないでUTCの時間でシリアライズされるので時間がずれてしまう
    // その為、serializeDate()をオーバーライドしてシリアライズ時にタイムゾーンをセットして日付文字列に変換する必要がある
    protected function serializeDate(DateTimeInterface $date)
    {
        return Carbon::instance($date)->tz('Asia/Tokyo')->format('Y-m-d H:i');
    }

    /** リレーション */

    public function item() {
        return $this->belongsTo('App\Models\Item');
    }

    public function color() {
        return $this->belongsTo('App\Models\Color');
    }

    public function size() {
        return $this->belongsTo('App\Models\Size');
    }

    public function images() {
        return $this->hasMany('App\Models\Image');
    }

    public function bookmarks() {
        return $this->hasMany('App\Models\Bookmark');
    }

    public function carts() {
        return $this->hasMany('App\Models\Cart');
    }
}

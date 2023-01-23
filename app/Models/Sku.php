<?php

namespace App\Models;

use App\Traits\TimestampCastTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Sku extends Model
{
    use SoftDeletes; // 論理削除
    use TimestampCastTrait;


    /** シリアライズ */

    // 編集不可カラム
    protected $guarded = [
        'id'
    ];

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

    public function bookmarks() {
        return $this->hasMany('App\Models\Bookmark');
    }

    public function carts() {
        return $this->hasMany('App\Models\Cart');
    }
}

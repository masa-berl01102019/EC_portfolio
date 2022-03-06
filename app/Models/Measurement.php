<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Measurement extends Model
{
    use SoftDeletes; // 論理削除

    /** シリアライズ */

    // 編集不可カラム
    protected $guarded = [
        'id'
    ];

    /** リレーション */

    public function item() {
        return $this->belongsTo('App\Models\Item');
    }

    public function size() {
        return $this->belongsTo('App\Models\Size');
    }
}

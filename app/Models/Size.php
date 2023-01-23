<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Size extends Model
{
    use SoftDeletes; // 論理削除

    /** シリアライズ */

    // 編集不可カラム
    protected $guarded = [
        'id'
    ];

    /** リレーション */

    public function skus() {
        return $this->hasMany('App\Models\Sku');
    }

    public function measurements() {
        return $this->hasMany('App\Models\Measurement');
    }
}

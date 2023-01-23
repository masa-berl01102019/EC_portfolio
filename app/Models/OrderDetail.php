<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class OrderDetail extends Model
{
    use SoftDeletes; //　論理削除

    /** シリアライズ */

    // 編集不可カラム
    protected $guarded = [
        'id'
    ];

    /** リレーション */

    public function order() {
        return $this->belongsTo('App\Models\Order');
    }

    public function sku() {
        return $this->belongsTo('App\Models\Sku');
    }
    
}

<?php

namespace App\Models;

use App\Traits\AccessorPriceTrait;
use Illuminate\Database\Eloquent\Model;
use App\Traits\CustomPaginateScopeTrait;
use Illuminate\Database\Eloquent\SoftDeletes;

class OrderDetail extends Model
{
    use SoftDeletes; // 論理削除
    use CustomPaginateScopeTrait;
    use AccessorPriceTrait;

    /** シリアライズ */

    // 編集不可カラム
    protected $guarded = [
        'id'
    ];

    /** アクセサ */

    // 配列内に含めたい独自の属性(カラム名)を定義
    protected $appends = ['order_price_text'];

    /** リレーション */

    public function order() {
        return $this->belongsTo('App\Models\Order');
    }

    public function sku() {
        return $this->belongsTo('App\Models\Sku');
    }
    
}

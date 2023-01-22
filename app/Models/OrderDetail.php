<?php

namespace App\Models;

use App\Traits\AccessorPriceTrait;
use Illuminate\Database\Eloquent\Model;
use App\Traits\CustomPaginateScopeTrait;
use Illuminate\Database\Eloquent\SoftDeletes;

class OrderDetail extends Model
{
    use SoftDeletes;
    use CustomPaginateScopeTrait;
    use AccessorPriceTrait;

    // Setting allowing Mass Assignment  * except columns in the array the below
    protected $guarded = [
        'id'
    ];

    /** Serializing */

    // Your own attributes (column names) which you want to include when the data is serialized from the model
    protected $appends = ['order_price_text'];

    /** Relationships */

    public function order()
    {
        return $this->belongsTo('App\Models\Order');
    }

    public function sku()
    {
        return $this->belongsTo('App\Models\Sku');
    }
}

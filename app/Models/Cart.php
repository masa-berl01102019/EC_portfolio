<?php

namespace App\Models;

use App\Traits\AccessorPriceTrait;
use Illuminate\Database\Eloquent\Model;
use App\Traits\CustomPaginateScopeTrait;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Cart extends Model
{
    use HasFactory;
    // use SoftDeletes;
    use AccessorPriceTrait;
    use CustomPaginateScopeTrait;

    // Setting allowing Mass Assignment  * except columns in the array the below
    protected $guarded = [
        'id'
    ];

    /** Static method */

    static function getUserCart($user_id)
    {
        // Get carts related with user ID which will be passed * Return an array includes sku ID of item which is published and not deleted
        return Self::where('user_id', $user_id)
            ->join('skus', 'carts.sku_id', '=', 'skus.id')
            ->join('items', function ($join) {
                $join->on('items.id', '=', 'skus.item_id')->where('is_published', config('define.is_published.open'));
            })
            ->pluck('sku_id')
            ->toArray();
    }

    /** Relationships */

    public function user()
    {
        return $this->belongsTo('App\Models\User');
    }

    public function sku()
    {
        return $this->belongsTo('App\Models\Sku');
    }
}

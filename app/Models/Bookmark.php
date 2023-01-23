<?php

namespace App\Models;

use App\Traits\AccessorPriceTrait;
use App\Traits\FilterSizeScopeTrait;
use App\Traits\FilterBrandScopeTrait;
use App\Traits\FilterColorScopeTrait;
use App\Traits\OrderByPriceScopeTrait;
use App\Traits\FilterKeywordScopeTrait;
use Illuminate\Database\Eloquent\Model;
use App\Traits\CustomPaginateScopeTrait;
use App\Traits\OrderByItemNameScopeTrait;
use App\Traits\OrderByCreatedAtScopeTrait;
use App\Traits\OrderByUpdatedAtScopeTrait;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Bookmark extends Model
{
    use HasFactory;
    // use SoftDeletes;
    use AccessorPriceTrait;
    use OrderByCreatedAtScopeTrait;
    use OrderByUpdatedAtScopeTrait;
    use OrderByItemNameScopeTrait;
    use OrderByPriceScopeTrait;
    use FilterKeywordScopeTrait;
    use FilterBrandScopeTrait;
    use FilterColorScopeTrait;
    use FilterSizeScopeTrait;
    use CustomPaginateScopeTrait;

    // Setting allowing Mass Assignment  * except columns in the array the below
    protected $guarded = [
        'id'
    ];

    /** Static method */

    static function getUserBookmark($user_id)
    {
        // Get bookmarks related with user ID which will be passed * Return an array includes sku ID of item which is published and not deleted
        return Self::where('user_id', $user_id)
            ->join('skus', 'bookmarks.sku_id', '=', 'skus.id')
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

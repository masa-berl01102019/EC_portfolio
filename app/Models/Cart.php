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

class Cart extends Model
{
    use HasFactory; // laravel8 factory関数使用する為
    // use SoftDeletes; // 論理削除
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

    /** シリアライズ */

    // 編集不可カラム
    protected $guarded = [
        'id'
    ];

    /** static method */

    static function getUserCart($user_id) {
        // userに紐づいてるカートを取得 *削除されてないかつ現在も公開されてる商品のsku_idの配列を返却
        return Self::where('user_id', $user_id)
            ->join('skus', 'carts.sku_id', '=', 'skus.id')
            ->join('items', function ($join) {
                $join->on('items.id', '=', 'skus.item_id')->where('is_published', config('define.is_published_r.open'));
            })
            ->pluck('sku_id')
            ->toArray();
    }
    
    /** リレーション */

    public function user() {
        return $this->belongsTo('App\Models\User');
    }

    public function sku() {
        return $this->belongsTo('App\Models\Sku');
    }
}

<?php

namespace App\Models;

use App\Traits\AccessorPriceTrait;
use App\Traits\TimestampCastTrait;
use App\Traits\OrderByNameScopeTrait;
use Illuminate\Database\Eloquent\Model;
use App\Traits\CustomPaginateScopeTrait;
use App\Traits\FilterDateRangeScopeTrait;
use App\Traits\OrderByCreatedAtScopeTrait;
use App\Traits\OrderByUpdatedAtScopeTrait;
use Illuminate\Database\Eloquent\SoftDeletes;

class Order extends Model
{
    use SoftDeletes; // 論理削除
    use AccessorPriceTrait;
    use OrderByNameScopeTrait;
    use OrderByCreatedAtScopeTrait;
    use OrderByUpdatedAtScopeTrait;
    use FilterDateRangeScopeTrait;
    use TimestampCastTrait;
    use CustomPaginateScopeTrait;

    /** シリアライズ */

    // 編集不可カラム
    protected $guarded = [
        'id'
    ];

    /** アクセサ */

    // 配列内に含めたい独自の属性(カラム名)を定義
    protected $appends = ['tax_amount_text', 'sub_total_text', 'total_amount_text', 'is_shipped_text', 'is_paid_text', 'payment_method_text'];

    public function getPaymentMethodTextAttribute()
    {
        return isset($this->payment_method) ? trans('api.const.payment_method')[$this->payment_method] : '';
    }

    public function getIsPaidTextAttribute()
    {
        return isset($this->is_paid) ? trans('api.const.is_paid')[$this->is_paid] : '';
    }

    public function getIsShippedTextAttribute()
    {
        return isset($this->is_shipped) ? trans('api.const.is_shipped')[$this->is_shipped] : '';
    }

    /** スコープ */

    public function scopeFilterIsShipped($query, $request)
    {
        $filter = $request->input('f_is_shipped');
        $flag = $filter !== null ? true : false;
        $query->when($flag, function ($query) use ($filter) {
            // カンマ区切りで配列に変換
            $receiver_arr = explode(',', $filter);
            // 配列内に該当する項目を絞り込み検索
            return $query->whereIn('is_shipped', $receiver_arr);
        });
    }

    public function scopeFilterIsPaid($query, $request)
    {
        $filter = $request->input('f_is_paid');
        $flag = $filter !== null ? true : false;
        $query->when($flag, function ($query) use ($filter) {
            // カンマ区切りで配列に変換
            $receiver_arr = explode(',', $filter);
            // 配列内に該当する項目を絞り込み検索
            return $query->whereIn('is_paid', $receiver_arr);
        });
    }

    public function scopeFilterPaymentMethod($query, $request)
    {
        $filter = $request->input('f_payment_method');
        $flag = $filter !== null ? true : false;
        $query->when($flag, function ($query) use ($filter) {
            // カンマ区切りで配列に変換
            $receiver_arr = explode(',', $filter);
            // 配列内に該当する項目を絞り込み検索
            return $query->whereIn('payment_method', $receiver_arr);
        });
    }

    public function scopeOrderByTotalAmount($query, $request)
    {
        $sort = $request->input('total_amount');
        $query->when($sort, function ($query, $sort) {
            return $query->orderBy('total_amount', $sort);
        });
    }

    public function scopeOrderByDeliveryDate($query, $request)
    {
        $sort = $request->input('delivery_date');
        $query->when($sort, function ($query, $sort) {
            return $query->orderBy('delivery_date', $sort);
        });
    }

    /** リレーション */

    public function user()
    {
        return $this->belongsTo('App\Models\User');
    }

    public function orderDetails()
    {
        return $this->hasMany('App\Models\OrderDetail');
    }
}

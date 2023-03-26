<?php

namespace App\Models;

use Laravel\Cashier\Billable;
use App\Traits\AccessorNameTrait;
use App\Traits\TimestampCastTrait;
use App\Traits\OrderByNameScopeTrait;
use App\Traits\FilterKeywordScopeTrait;
use App\Traits\CustomPaginateScopeTrait;
use Illuminate\Notifications\Notifiable;
use App\Traits\FilterDateFromScopeTrait;
use App\Traits\FilterDateToScopeTrait;
use App\Traits\OrderByCreatedAtScopeTrait;
use App\Traits\OrderByUpdatedAtScopeTrait;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use HasFactory;
    use Notifiable;
    use SoftDeletes;
    use AccessorNameTrait;
    use OrderByNameScopeTrait;
    use OrderByCreatedAtScopeTrait;
    use OrderByUpdatedAtScopeTrait;
    use FilterKeywordScopeTrait;
    use FilterDateFromScopeTrait;
    use FilterDateToScopeTrait;
    use TimestampCastTrait;
    use CustomPaginateScopeTrait;
    use Billable; // For leravel stripe

    // Setting allowing Mass Assignment  * except columns in the array the below
    protected $guarded = [
        'id'
    ];

    /** Serializing */

    // Setting columns to hide
    protected $hidden = [
        'password', 'remember_token',
    ];

    // Setting the date format
    protected $casts = [
        'birthday' => 'date:Y/m/d'
    ];

    // Your own attributes (column names) which you want to include
    protected $appends = ['post_code_text', 'delivery_post_code_text', 'full_delivery_address', 'full_address', 'gender_text', 'is_received_text', 'full_name', 'full_name_kana'];

    /** Accessors */

    public function getGenderTextAttribute()
    {
        return isset($this->gender) ? trans('api.const.gender')[$this->gender] : '';
    }

    public function getIsReceivedTextAttribute()
    {
        return isset($this->is_received) ? trans('api.const.is_received')[$this->is_received] : '';
    }

    public function getFullAddressAttribute()
    {
        return $this->prefecture . $this->municipality . $this->street_name . $this->street_number . $this->building;
    }

    public function getFullDeliveryAddressAttribute()
    {
        return $this->delivery_prefecture . $this->delivery_municipality . $this->delivery_street_name . $this->delivery_street_number . $this->delivery_building;
    }

    public function getPostCodeTextAttribute()
    {
        return !empty($this->post_code) ? '〒' . substr_replace($this->post_code, "-", 3, 0) : '';
    }

    public function getDeliveryPostCodeTextAttribute()
    {
        return !empty($this->delivery_post_code) ? '〒' . substr_replace($this->delivery_post_code, "-", 3, 0) : '';
    }

    /** Query scopes */

    public function scopeFilterGender($query, $request)
    {
        $filter = $request->input('f_gender');
        $flag = $filter !== null ? true : false;
        $query->when($flag, function ($query) use ($filter) {
            $gender_arr = explode(',', $filter);
            return $query->whereIn('gender', $gender_arr);
        });
    }

    public function scopeFilterIsReceived($query, $request)
    {
        $filter = $request->input('f_is_received');
        $flag = $filter !== null ? true : false;
        $query->when($flag, function ($query) use ($filter) {
            $receiver_arr = explode(',', $filter);
            return $query->whereIn('is_received', $receiver_arr);
        });
    }

    public function scopeOrderByBirthday($query, $request)
    {
        $sort = $request->input('birthday');
        $query->when($sort, function ($query, $sort) {
            return $query->orderBy('birthday', $sort);
        });
    }

    /** Static method */

    public static function getUserOrderedItemId()
    {
        // Get user ID which has order history and order item ID
        $users = Self::select(['users.id', 'items.id as order_item_id'])
            ->join('orders', 'users.id', '=', 'orders.user_id')
            ->join('order_details', 'orders.id', '=', 'order_details.order_id')
            ->join('skus', 'skus.id', '=', 'order_details.sku_id')
            ->join('items', function ($join) {
                $join->on('items.id', '=', 'skus.item_id')
                    ->where('is_published', config('define.is_published.open'))->where('items.deleted_at', null);
            })
            ->groupBy('users.id', 'order_item_id')
            ->get()->toArray();

        $order_recodes = [];
        // Store order item ID in an array for each user ID
        foreach ($users as $value) {
            $order_recodes[$value['id']][] = $value['order_item_id'];
        }
        return $order_recodes;
    }

    /** Relationships */

    public function bookmarks()
    {
        return $this->hasMany('App\Models\Bookmark');
    }

    public function carts()
    {
        return $this->hasMany('App\Models\Cart');
    }

    public function contacts()
    {
        return $this->hasMany('App\Models\Contact');
    }

    public function orders()
    {
        return $this->hasMany('App\Models\Order');
    }
}

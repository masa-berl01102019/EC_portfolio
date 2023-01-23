<?php

namespace App\Models;

use App\Traits\AccessorNameTrait;
use App\Traits\TimestampCastTrait;
use App\Traits\OrderByNameScopeTrait;
use App\Traits\FilterKeywordScopeTrait;
use Illuminate\Database\Eloquent\Model;
use App\Traits\CustomPaginateScopeTrait;
use App\Traits\FilterDateRangeScopeTrait;
use App\Traits\OrderByCreatedAtScopeTrait;
use App\Traits\OrderByUpdatedAtScopeTrait;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Contact extends Model
{
    use HasFactory;
    use SoftDeletes;
    use AccessorNameTrait;
    use OrderByNameScopeTrait;
    use OrderByCreatedAtScopeTrait;
    use OrderByUpdatedAtScopeTrait;
    use FilterKeywordScopeTrait;
    use FilterDateRangeScopeTrait;
    use TimestampCastTrait;
    use CustomPaginateScopeTrait;

    // Setting not to create updated_at column
    const UPDATED_AT = NULL;

    // Setting allowing Mass Assignment  * except columns in the array the below
    protected $guarded = [
        'id'
    ];

    /** Accessors */

    public function getResponseStatusTextAttribute()
    {
        return isset($this->response_status) ? trans('api.const.response_status')[$this->response_status] : '';
    }

    /** Serializing */

    // Setting the date format
    protected $casts = [
        'updated_at' => 'date:Y/m/d H:i'
    ];

    // Your own attributes (column names) which you want to include
    protected $appends = ['response_status_text', 'full_name', 'full_name_kana'];

    /** Query scopes */

    public function scopeFilterResponseStatus($query, $request)
    {
        $filter = $request->input('f_response_status');
        $flag = $filter !== null ? true : false;
        $query->when($flag, function ($query) use ($filter) {
            $status_arr = explode(',', $filter);
            return $query->whereIn('response_status', $status_arr);
        });
    }

    /** Relationships */

    public function user()
    {
        return $this->belongsTo('App\Models\User');
    }

    public function admin()
    {
        return $this->belongsTo('App\Models\Admin');
    }
}

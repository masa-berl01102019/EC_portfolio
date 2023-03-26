<?php

namespace App\Models;

use App\Traits\AccessorNameTrait;
use App\Traits\AccessorPublishTrait;
use App\Traits\GetPublishedScopeTrait;
use App\Traits\FilterKeywordScopeTrait;
use Illuminate\Database\Eloquent\Model;
use App\Traits\CustomPaginateScopeTrait;
use App\Traits\FilterDateFromScopeTrait;
use App\Traits\FilterDateToScopeTrait;
use App\Traits\OrderByPostedAtScopeTrait;
use App\Traits\FilterIsPublishedScopeTrait;
use App\Traits\OrderByModifiedAtScopeTrait;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Notification extends Model
{
    use HasFactory;
    use SoftDeletes;
    use AccessorPublishTrait;
    use AccessorNameTrait;
    use OrderByPostedAtScopeTrait;
    use OrderByModifiedAtScopeTrait;
    use FilterKeywordScopeTrait;
    use FilterDateFromScopeTrait;
    use FilterDateToScopeTrait;
    use FilterIsPublishedScopeTrait;
    use GetPublishedScopeTrait;
    use CustomPaginateScopeTrait;

    // An error will occur when inserting data in case that isn't defined timestamps() in migration files
    public $timestamps = false;

    // Setting allowing Mass Assignment  * except columns in the array the below
    protected $guarded = [
        'id'
    ];

    /** Serializing */

    // Setting the date format
    protected $casts = [
        'posted_at' => 'date:Y/m/d H:i',
        'modified_at' => 'date:Y/m/d H:i',
        'expired_at' => 'date:Y/m/d H:i',
    ];

    // Your own attributes (column names) which you want to include
    protected $appends = ['is_published_text', 'full_name', 'full_name_kana'];

    /** Query scopes */

    public function scopeOrderByExpiredAt($query, $request)
    {
        $sort = $request->input('expired_at');
        $query->when($sort, function ($query, $sort) {
            return $query->orderBy('expired_at', $sort);
        });
    }

    /** Relationships */

    public function admin()
    {
        return $this->belongsTo('App\Models\Admin');
    }
}

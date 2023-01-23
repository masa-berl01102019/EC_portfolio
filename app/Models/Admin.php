<?php

namespace App\Models;

use App\Traits\AccessorNameTrait;
use App\Traits\TimestampCastTrait;
use App\Traits\OrderByNameScopeTrait;
use App\Traits\FilterKeywordScopeTrait;
use App\Traits\CustomPaginateScopeTrait;
use Illuminate\Notifications\Notifiable;
use App\Traits\FilterDateRangeScopeTrait;
use App\Traits\OrderByCreatedAtScopeTrait;
use App\Traits\OrderByUpdatedAtScopeTrait;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Admin extends Authenticatable
{
    use HasFactory; // It has to be call at models in order to use factory function in Laravel 8
    use Notifiable; // It's not used yet
    use SoftDeletes;
    use AccessorNameTrait;
    use OrderByNameScopeTrait;
    use OrderByCreatedAtScopeTrait;
    use OrderByUpdatedAtScopeTrait;
    use FilterKeywordScopeTrait;
    use FilterDateRangeScopeTrait;
    use TimestampCastTrait;
    use CustomPaginateScopeTrait;

    // Setting allowing Mass Assignment  * except columns in the array the below
    protected $guarded = [
        'id'
    ];

    /** Serializing */

    // Setting columns to hide
    protected $hidden = [
        'password', 'remember_token',
    ];

    // Your own attributes (column names) which you want to include
    protected $appends = ['full_name', 'full_name_kana'];

    /** Relationships */

    public function news()
    {
        return $this->hasMany('App\Models\News');
    }

    public function blogs()
    {
        return $this->hasMany('App\Models\Blog');
    }

    public function items()
    {
        return $this->hasMany('App\Models\Item');
    }

    public function notifications()
    {
        return $this->hasMany('App\Models\Notification');
    }

    public function contacts()
    {
        return $this->hasMany('App\Models\Contact');
    }
}

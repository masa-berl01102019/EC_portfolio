<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Brand extends Model
{
    use SoftDeletes;

    // Setting allowing Mass Assignment  * except columns in the array the below
    protected $guarded = [
        'id'
    ];

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
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Color extends Model
{
    // use SoftDeletes;

    // Setting allowing Mass Assignment  * except columns in the array the below
    protected $guarded = [
        'id'
    ];

    /** Relationships */

    public function skus()
    {
        return $this->hasMany('App\Models\Sku');
    }

    public function images()
    {
        return $this->hasMany('App\Models\Image');
    }
}

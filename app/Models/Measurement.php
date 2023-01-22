<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Measurement extends Model
{
    use SoftDeletes;

    // Setting allowing Mass Assignment  * except columns in the array the below
    protected $guarded = [
        'id'
    ];

    /** Relationships */

    public function item()
    {
        return $this->belongsTo('App\Models\Item');
    }

    public function size()
    {
        return $this->belongsTo('App\Models\Size');
    }
}

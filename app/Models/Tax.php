<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Tax extends Model
{
    use SoftDeletes;

    // Setting allowing Mass Assignment  * except columns in the array the below
    protected $guarded = [
        'id'
    ];

    /** Static method */

    static function getTaxRate()
    {
        $tax_rate = Self::where('from', '<', now())->where('to', '>', now())->first()->percentage;
        return $tax_rate / 100;
    }
}

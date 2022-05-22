<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Tax extends Model
{
    use SoftDeletes; // 論理削除

    /** シリアライズ */

    // 編集不可カラム
    protected $guarded = [
        'id'
    ];

    /** static method */

    static function getTaxRate() {
        $tax_rate = Self::where('from', '<', now())->where('to', '>', now())->first()->percentage;
        return $tax_rate / 100;
    }

}

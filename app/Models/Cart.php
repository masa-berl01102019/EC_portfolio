<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Cart extends Model
{
    use HasFactory; // laravel8 factory関数使用する為
    use SoftDeletes; //　論理削除

    /** シリアライズ */

    // 編集不可カラム
    protected $guarded = [
        'id'
    ];

    /** リレーション */

    public function user() {
        return $this->belongsTo('App\Models\User');
    }

    public function sku() {
        return $this->belongsTo('App\Models\Sku');
    }
}

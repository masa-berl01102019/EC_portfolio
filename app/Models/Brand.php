<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Brand extends Model
{
    use SoftDeletes; //　論理削除

    /** シリアライズ */

    // 編集不可カラム
    protected $guarded = [
        'id'
    ];

    /** リレーション */

    public function news() {
        return $this->hasMany('App\Models\News');
    }

    public function blogs() {
        return $this->hasMany('App\Models\Blog');
    }

    public function items() {
        return $this->hasMany('App\Models\Item');
    }

}

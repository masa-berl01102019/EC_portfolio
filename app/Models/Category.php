<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Category extends Model
{
    use SoftDeletes; // 論理削除

    /** シリアライズ */

    // 編集不可カラム
    protected $guarded = [
        'id'
    ];

    /** リレーション */

    public function items() {
        return $this->belongsToMany('App\Models\Item');
    }

    // 階層構造用にリレーション
    public function parent() {
        return $this->belongsTo('App\Models\Category', "parent_id", "id");
    }

    // 階層構造用にリレーション
    public function children() {
        return $this->hasMany('App\Models\Category', "parent_id", "id");
    }

    // 階層構造用にリレーション
    public function grandChildren() {
        return $this->hasMany('App\Models\Category', "parent_id", "id");
    }

    public function blog() {
        return $this->hasOne('App\Models\Blog');
    }

}

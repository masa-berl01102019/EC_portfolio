<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Category extends Model
{
    // use SoftDeletes; // 論理削除

    /** シリアライズ */

    // 編集不可カラム
    protected $guarded = [
        'id'
    ];

    /** static method */

    public static function genderCategories () {
        return  Self::select('id', 'category_name', 'parent_id')->whereIn('id', [1,2]);
    }

    public static function mainCategories () {
        return Self::select('id', 'category_name', 'parent_id')->whereIn('parent_id', [1,2]);
    }

    public static function subCategories () {
        return Self::select('depth_3.id', 'depth_3.category_name', 'depth_3.parent_id')
                    ->join('categories as depth_2','depth_2.parent_id','=','categories.id')
                    ->join('categories as depth_3','depth_3.parent_id','=','depth_2.id');
    }

    /** リレーション */

    public function items() {
        return $this->belongsToMany('App\Models\Item');
    }

    public function blogs() {
        return $this->hasMany('App\Models\Blog');
    }

    public function news() {
        return $this->hasMany('App\Models\News');
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

}

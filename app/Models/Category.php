<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Category extends Model
{
    // use SoftDeletes;

    // Setting allowing Mass Assignment  * except columns in the array the below
    protected $guarded = [
        'id'
    ];

    /** Static method */

    public static function genderCategories()
    {
        $gender_category_arr = array_values(config('define.gender_category'));

        return  Self::select('id', 'category_name', 'parent_id')->whereIn('id', $gender_category_arr);
    }

    public static function mainCategories()
    {
        $gender_category_arr = array_values(config('define.gender_category'));

        return Self::select('id', 'category_name', 'parent_id')->whereIn('parent_id', $gender_category_arr);
    }

    public static function subCategories()
    {
        return Self::select('depth_3.id', 'depth_3.category_name', 'depth_3.parent_id')
            ->join('categories as depth_2', 'depth_2.parent_id', '=', 'categories.id')
            ->join('categories as depth_3', 'depth_3.parent_id', '=', 'depth_2.id');
    }

    /** Relationships */

    public function items()
    {
        return $this->belongsToMany('App\Models\Item');
    }

    public function blogs()
    {
        return $this->hasMany('App\Models\Blog');
    }

    public function news()
    {
        return $this->hasMany('App\Models\News');
    }

    public function parent()
    {
        return $this->belongsTo('App\Models\Category', "parent_id", "id");
    }

    public function children()
    {
        return $this->hasMany('App\Models\Category', "parent_id", "id");
    }

    public function grandChildren()
    {
        return $this->hasMany('App\Models\Category', "parent_id", "id");
    }
}

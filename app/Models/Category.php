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
        return Self::select('id', 'category_name', 'category_type', 'parent_id')->where('category_type', config('define.category_type.gender'));
    }

    public static function mainCategories()
    {
        return Self::select('id', 'category_name', 'category_type', 'parent_id')->where('category_type', config('define.category_type.main'));
    }

    public static function subCategories()
    {
        return Self::select('id', 'category_name', 'category_type', 'parent_id')->where('category_type', config('define.category_type.sub'));
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

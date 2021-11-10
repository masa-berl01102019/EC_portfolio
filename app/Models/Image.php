<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Image extends Model
{
    use SoftDeletes; //　論理削除

    /** シリアライズ */

    // 編集不可カラム
    protected $guarded = [
        'id'
    ];

    /** アクセサ */

    // 配列内に含めたい独自の属性(カラム名)を定義
    protected $appends = ['image_category_text'];

    public function getImageCategoryTextAttribute() {
        return isset($this->image_category) ? config('define.image_category')[$this->image_category]: '';
    }

    /** リレーション */

    public function item() {
        return $this->belongsTo('App\Models\Item');
    }

    public function colors() {
        return $this->belongsToMany('App\Models\Color');
    }

}

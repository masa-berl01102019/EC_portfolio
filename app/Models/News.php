<?php

namespace App\Models;

use App\Traits\NameAccessorTrait;
use App\Traits\FilterTagScopeTrait;
use App\Traits\PublishAccessorTrait;
use App\Traits\FilterBrandScopeTrait;
use App\Traits\FilterKeywordScopeTrait;
use Illuminate\Database\Eloquent\Model;
use App\Traits\FilterDateRangeScopeTrait;
use App\Traits\OrderByPostedAtScopeTrait;
use App\Traits\FilterIsPublishedScopeTrait;
use App\Traits\GenderCategoryAccessorTrait;
use App\Traits\OrderByModifiedAtScopeTrait;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\FilterGenderCategoryScopeTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class News extends Model
{
    use HasFactory; // laravel8 factory関数使用する為
    use SoftDeletes; // 論理削除
    use NameAccessorTrait;
    use PublishAccessorTrait;
    use OrderByPostedAtScopeTrait;
    use OrderByModifiedAtScopeTrait;
    use FilterKeywordScopeTrait;
    use FilterDateRangeScopeTrait;
    use FilterIsPublishedScopeTrait;
    use FilterTagScopeTrait;
    use FilterBrandScopeTrait;
    use GenderCategoryAccessorTrait;
    use FilterGenderCategoryScopeTrait;

    // timestamp無効にしないとデータ挿入時にエラーになる
    public $timestamps = false;

    /** シリアライズ */

    // 編集不可カラム
    protected $guarded = [
        'id'
    ];

    // モデルからシリアライズ時の日付形式の設定
    protected $casts = [
        'posted_at' => 'date:Y-m-d',
        'modified_at' => 'date:Y-m-d',
    ];

    /** アクセサ */

    // 配列内に含めたい独自の属性(カラム名)を定義
    protected $appends = ['full_name', 'full_name_kana', 'is_published_text', 'gender_category_text'];

    /** リレーション */

    public function brand() {
        return $this->belongsTo('App\Models\Brand');
    }

    public function admin() {
        return $this->belongsTo('App\Models\Admin');
    }

    public function tags() {
        return $this->belongsToMany('App\Models\Tag');
    }

    public function category() {
        return $this->belongsTo('App\Models\Category');
    }
}

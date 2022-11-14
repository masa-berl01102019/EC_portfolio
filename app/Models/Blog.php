<?php

namespace App\Models;

use App\Traits\AccessorNameTrait;
use App\Traits\FilterTagScopeTrait;
use App\Traits\AccessorPublishTrait;
use App\Traits\FilterBrandScopeTrait;
use App\Traits\GetPublishedScopeTrait;
use App\Traits\FilterKeywordScopeTrait;
use Illuminate\Database\Eloquent\Model;
use App\Traits\CustomPaginateScopeTrait;
use App\Traits\FilterDateRangeScopeTrait;
use App\Traits\OrderByPostedAtScopeTrait;
use App\Traits\AccessorGenderCategoryTrait;
use App\Traits\FilterIsPublishedScopeTrait;
use App\Traits\OrderByModifiedAtScopeTrait;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\FilterGenderCategoryScopeTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Blog extends Model
{
    use HasFactory; // laravel8 factory関数使用する為
    use SoftDeletes; // 論理削除
    use AccessorNameTrait;
    use AccessorPublishTrait;
    use AccessorGenderCategoryTrait;
    use OrderByPostedAtScopeTrait;
    use OrderByModifiedAtScopeTrait;
    use FilterKeywordScopeTrait;
    use FilterDateRangeScopeTrait;
    use FilterIsPublishedScopeTrait;
    use FilterTagScopeTrait;
    use FilterBrandScopeTrait;
    use FilterGenderCategoryScopeTrait;
    use GetPublishedScopeTrait;
    use CustomPaginateScopeTrait;

    // timestamp無効にしないとデータ挿入時にエラーになる
    public $timestamps = false;

    /** シリアライズ */

    // 編集不可カラム
    protected $guarded = [
        'id'
    ];

    // モデルからシリアライズ時の日付形式の設定
    protected $casts = [
        'posted_at' => 'date:Y/m/d H:i',
        'modified_at' => 'date:Y/m/d H:i',
    ];

    /** アクセサ */

    // 配列内に含めたい独自の属性(カラム名)を定義
    protected $appends = ['full_name', 'full_name_kana', 'is_published_text', 'gender_category_text'];

    /** スコープ */

    public function scopeFilterItem($query, $request)
    {
        $filter = $request->input('f_item');
        $flag = $filter !== null ? true : false;
        $query->when($flag, function ($query) use ($filter) {
            $query->whereHas('items', function ($query) use ($filter) {
                // カンマ区切りで配列に変換
                $receiver_arr = explode(',', $filter);
                // 配列内に該当する項目を絞り込み検索
                return $query->whereIn('items.id', $receiver_arr);
            });
        });
    }

    /** リレーション */

    public function brand()
    {
        return $this->belongsTo('App\Models\Brand');
    }

    public function admin()
    {
        return $this->belongsTo('App\Models\Admin');
    }

    public function tags()
    {
        return $this->belongsToMany('App\Models\Tag');
    }

    public function items()
    {
        return $this->belongsToMany('App\Models\Item');
    }

    public function category()
    {
        return $this->belongsTo('App\Models\Category');
    }

    /** 条件付きリレーション * withでリレーション組んで静的に呼び出せる */

    public function publishedItems()
    {
        // 紐づく商品の内、公開ステータスが公開の商品のみを取得
        return $this->belongsToMany('App\Models\Item')->getPublished();
    }
}

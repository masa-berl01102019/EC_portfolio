<?php

namespace App\Models;

use App\Traits\AccessorPriceTrait;
use App\Traits\FilterTagScopeTrait;
use App\Traits\AccessorPublishTrait;
use App\Traits\FilterBrandScopeTrait;
use App\Traits\FilterKeywordScopeTrait;
use Illuminate\Database\Eloquent\Model;
use App\Traits\CustomPaginateScopeTrait;
use App\Traits\FilterDateRangeScopeTrait;
use App\Traits\OrderByPostedAtScopeTrait;
use App\Traits\FilterIsPublishedScopeTrait;
use App\Traits\OrderByModifiedAtScopeTrait;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Item extends Model
{
    use HasFactory; // laravel8 factory関数使用する為
    use SoftDeletes; // 論理削除
    use AccessorPublishTrait;
    use AccessorPriceTrait;
    use OrderByPostedAtScopeTrait;
    use OrderByModifiedAtScopeTrait;
    use FilterKeywordScopeTrait;
    use FilterDateRangeScopeTrait;
    use FilterIsPublishedScopeTrait;
    use FilterTagScopeTrait;
    use FilterBrandScopeTrait;
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
    protected $appends = ['is_published_text', 'price_text', 'cost_text'];

    /** スコープ */

    public function scopeFilterCategory($query, $request) {
        $gender_category = $request->input('f_gender_category');
        $main_category = $request->input('f_main_category');
        $sub_category = $request->input('f_sub_category');
        // カテゴリフィルターは詳細度の高いものを優先順位にして代入
        if($sub_category) {
            $filter = $sub_category;
        } else if ($main_category) {
            $filter = $main_category;
        } else {
            $filter = $gender_category;
        }
        $flag = $filter !== null ? true : false;
        $query->when($flag, function($query) use($filter) {
            $query->whereHas('categories', function ($query) use($filter) {
                // カンマ区切りで配列に変換
                $receiver_arr = explode(',',$filter);
                // 配列内に該当する項目を絞り込み検索
                return $query->where('categories.id', $receiver_arr);
            });
        });
    }

    public function scopeFilterColor($query, $request) {
        $filter = $request->input('f_color');
        $flag = $filter !== null ? true : false;
        $query->when($flag, function($query) use($filter) {
            $query->whereHas('skus.color', function ($query) use($filter) {
                // カンマ区切りで配列に変換
                $receiver_arr = explode(',',$filter);
                // 配列内に該当する項目を絞り込み検索
                return $query->whereIn('id', $receiver_arr);
            });
        });
    }

    public function scopeFilterSize($query, $request) {
        $filter = $request->input('f_size');
        $flag = $filter !== null ? true : false;
        $query->when($flag, function($query) use($filter) {
            $query->whereHas('skus.size', function ($query) use($filter) {
                // カンマ区切りで配列に変換
                $receiver_arr = explode(',',$filter);
                // 配列内に該当する項目を絞り込み検索
                return $query->whereIn('id', $receiver_arr);
            });
        });
    }

    public function scopeOrderByProductNumber($query, $request) {
        $sort = $request->input('product_number');
        $query->when($sort, function($query, $sort) {
            return $query->orderBy('product_number', $sort);
        });
    }

    public function scopeOrderByItemName($query, $request) {
        $sort = $request->input('item_name');
        $query->when($sort, function($query, $sort) {
            return $query->orderBy('item_name', $sort);
        });
    }

    public function scopeOrderByPrice($query, $request) {
        $sort = $request->input('price');
        $query->when($sort, function($query, $sort) {
            return $query->orderBy('price', $sort);
        });
    }

    public function scopeOrderByCost($query, $request) {
        $sort = $request->input('cost');
        $query->when($sort, function($query, $sort) {
            return $query->orderBy('cost', $sort);
        });
    }

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

    public function categories() {
        return $this->belongsToMany('App\Models\Category');
    }

    public function blogs() {
        return $this->belongsToMany('App\Models\Blog');
    }

    public function images() {
        return $this->hasMany('App\Models\Image');
    }

    public function skus() {
        return $this->hasMany('App\Models\Sku');
    }

    public function measurements() {
        return $this->hasMany('App\Models\Measurement');
    }

    /** 条件付きリレーション * withでリレーション組んで静的に呼び出せる */

    public function genderCategory() {
        // men's: 1 ladies: 2 は固定なのでリレーションとしてインスタンス化する際に予めに絞っておく
        return $this->belongsToMany('App\Models\Category')->whereIn('categories.id', [1,2]);
    }

    public function mainCategory() {
         // men's: 1 ladies: 2 を親IDに持つものがメインカテゴリなのでリレーションとしてインスタンス化する際に予めに絞っておく
        return $this->belongsToMany('App\Models\Category')->whereIn('categories.parent_id', [1,2]);
    }

    public function subCategory() {
        // メインカテゴリのIDを配列で取得
        $main_categories = Category::mainCategories()->pluck('id')->toArray();
        // メインカテゴリのIDを親IDに持つものがサブカテゴリなのでリレーションとしてインスタンス化する際に予めに絞っておく
        return $this->belongsToMany('App\Models\Category')->whereIn('categories.parent_id', $main_categories);
    }
}

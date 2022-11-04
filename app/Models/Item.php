<?php

namespace App\Models;

use Carbon\Carbon;
use App\Traits\AccessorPriceTrait;
use Illuminate\Support\Facades\DB;
use App\Traits\FilterTagScopeTrait;
use App\Traits\AccessorPublishTrait;
use App\Traits\FilterSizeScopeTrait;
use App\Traits\FilterBrandScopeTrait;
use App\Traits\FilterColorScopeTrait;
use App\Traits\GetPublishedScopeTrait;
use App\Traits\OrderByPriceScopeTrait;
use App\Traits\FilterKeywordScopeTrait;
use Illuminate\Database\Eloquent\Model;
use App\Traits\CustomPaginateScopeTrait;
use App\Traits\FilterDateRangeScopeTrait;
use App\Traits\OrderByItemNameScopeTrait;
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
    use OrderByItemNameScopeTrait;
    use OrderByPriceScopeTrait;
    use FilterKeywordScopeTrait;
    use FilterDateRangeScopeTrait;
    use FilterIsPublishedScopeTrait;
    use FilterTagScopeTrait;
    use FilterBrandScopeTrait;
    use FilterColorScopeTrait;
    use FilterSizeScopeTrait;
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
    protected $appends = ['is_published_text', 'price_text', 'cost_text', 'included_tax_price', 'included_tax_price_text'];

    /** スコープ */

    public function scopeFilterCategory($query, $request)
    {
        $gender_category = $request->input('f_gender_category');
        $main_category = $request->input('f_main_category');
        $sub_category = $request->input('f_sub_category');
        // カテゴリフィルターは詳細度の高いものを優先順位にして代入
        if ($sub_category) {
            $filter = $sub_category;
        } else if ($main_category) {
            $filter = $main_category;
        } else {
            $filter = $gender_category;
        }
        $flag = $filter !== null ? true : false;
        $query->when($flag, function ($query) use ($filter) {
            $query->whereHas('categories', function ($query) use ($filter) {
                // カンマ区切りで配列に変換
                $receiver_arr = explode(',', $filter);
                // 配列内に該当する項目を絞り込み検索
                return $query->where('categories.id', $receiver_arr);
            });
        });
    }

    public function scopeOrderByProductNumber($query, $request)
    {
        $sort = $request->input('product_number');
        $query->when($sort, function ($query, $sort) {
            return $query->orderBy('product_number', $sort);
        });
    }

    public function scopeOrderByCost($query, $request)
    {
        $sort = $request->input('cost');
        $query->when($sort, function ($query, $sort) {
            return $query->orderBy('cost', $sort);
        });
    }

    /** static method */
    public static function itemNew()
    {
        // 当日から2か月前を新着商品と定義
        $begin = Carbon::today()->subMonth(2);

        return Self::getPublished()->with(['brand', 'categories', 'topImage'])
            ->where('posted_at', '>=', $begin)
            ->orderBy('posted_at', 'desc');
    }

    public static function itemRanking()
    {
        // 商品の非公開ステータスも含んだ商品単位のブックマークの集計 * skuの論理削除されたものは除外してる
        $bookmark_quantity = DB::table('skus')
            ->join('bookmarks', 'skus.id', '=', 'bookmarks.sku_id')
            ->select('item_id', DB::raw('count(bookmarks.id) as booked'))
            ->where('skus.deleted_at', null)
            ->groupBy('item_id');

        // 商品の非公開ステータスも含んだ商品単位のカートの集計 * skuの論理削除されたものは除外してる 同SKUの数量単位では集計してない
        $cart_quantity = DB::table('skus')
            ->join('carts', 'skus.id', '=', 'carts.sku_id')
            ->select('item_id', DB::raw('count(carts.id) as cart'))
            ->where('skus.deleted_at', null)
            ->groupBy('item_id');

        // 商品の非公開ステータスも含んだ商品単位の購入実績点数の集計 * skuの論理削除されたものは除外してる
        $order_quantity = DB::table('skus')
            ->join('order_details', 'skus.id', '=', 'order_details.sku_id')
            ->select('item_id', DB::raw('sum(order_details.order_quantity) as ordered'))
            ->where('skus.deleted_at', null)
            ->groupBy('item_id');

        // 上記で集計した物をjoinSubでサブクエリとして挿入
        return Self::getPublished()->with(['brand', 'categories', 'topImage'])
            ->joinSub($bookmark_quantity, 'bookmark_quantity', function ($join) {
                $join->on('items.id', '=', 'bookmark_quantity.item_id');
            })
            ->joinSub($cart_quantity, 'cart_quantity', function ($join) {
                $join->on('items.id', '=', 'cart_quantity.item_id');
            })
            ->joinSub($order_quantity, 'order_quantity', function ($join) {
                $join->on('items.id', '=', 'order_quantity.item_id');
            })
            ->orderBy('ordered', 'desc')
            ->orderBy('cart', 'desc')
            ->orderBy('booked', 'desc');
    }

    public static function getRelatedItems($item_id)
    {
        // 中間テーブルから商品IDをもつカテゴリIDを取得
        $tag_arr = getRelatedTagId($item_id);
        // 中間テーブルから商品IDをもつカテゴリIDを取得
        $category_arr = getRelatedCategoryId($item_id);
        // gender_categoryを除外
        array_shift($category_arr);
        // 関連商品の取得
        $related_item = Self::getPublished()->where('id', '!=', $item_id)
            ->with(['categories', 'tags', 'brand', 'topImage'])
            ->whereHas('categories', function ($query) use ($category_arr) {
                // メインカテゴリもしくはサブカテゴリが一致する商品を絞り込む
                return $query->whereIn('categories.id', $category_arr);
            })
            ->whereHas('tags', function ($query) use ($tag_arr) {
                // タグが一致する商品を絞り込む
                return $query->whereIn('tags.id', $tag_arr);
            })->get();

        // 取得した関連商品を展開
        foreach ($related_item as $key => $value) {
            // 関連商品に紐づくカテゴリやタグのIDを配列で抜き出しarray_intersectで共通項を取得しカウントした値を元の関連商品のプロパティと各配列に格納
            $related_item[$key]['category_similarity'] = count(array_intersect($category_arr, array_column($value['categories']->toArray(), 'id')));
            $related_item[$key]['tag_similarity'] = count(array_intersect($tag_arr, array_column($value['tags']->toArray(), 'id')));
        }

        // ソートして先頭6件を抜き出し
        $collection = $related_item->sortBy([
            ['category_similarity', 'desc'],
            ['tag_similarity', 'desc'],
        ])->values()->take(6);

        return $collection;
    }

    public static function getRecommendItems($order_recodes, $watched_item_arr, $request)
    {
        $similar_users = [];
        foreach ($order_recodes as $user_id_key => $order_arr) {
            // count the number which is common between user-watched-item and users-ordered-item
            $count = count(array_intersect($watched_item_arr, $order_arr));
            //  store user ID as key and the number counted as value in Array if there is common between them more than one 
            if ($count) $similar_users[$user_id_key] = $count;
        }
        // sort ID in the order of user with high similarity
        arsort($similar_users);
        // put user ID out from Array
        $similar_users = array_keys($similar_users);
        $recommend_item_arr = [];
        // merge item ID into Array in the order of sorted user ID
        foreach ($similar_users as $user_id) {
            $recommend_item_arr = array_merge($recommend_item_arr, $order_recodes[$user_id]);
        }
        // delete duplicated item ID
        $recommend_item_arr = array_unique($recommend_item_arr);
        $recommend_items = [];
        // get item in the order of item ID sorted 
        foreach ($recommend_item_arr as $item_id) {
            $item = Self::where('id', $item_id)->with(['brand', 'genderCategory', 'topImage'])->filterCategory($request)->first();
            if (!empty($item)) $recommend_items[] = $item;
        }

        return collect($recommend_items);
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

    public function categories()
    {
        return $this->belongsToMany('App\Models\Category');
    }

    public function blogs()
    {
        return $this->belongsToMany('App\Models\Blog');
    }

    public function images()
    {
        return $this->hasMany('App\Models\Image');
    }

    public function skus()
    {
        return $this->hasMany('App\Models\Sku');
    }

    public function measurements()
    {
        return $this->hasMany('App\Models\Measurement');
    }

    /** 条件付きリレーション * withでリレーション組んで静的に呼び出せる */

    public function publishedBlogs()
    {
        // 紐づくのブログの内、公開ステータスが公開のブログのみを取得
        return $this->belongsToMany('App\Models\Blog')->getPublished();
    }

    public function topImage()
    {
        // 紐づくの画像の内、main画像を取得出来る
        return $this->hasMany('App\Models\Image')->where('image_category', config('define.image_category_r.main'));
    }

    public function genderCategory()
    {
        // men's: 1 ladies: 2 は固定なのでリレーションとしてインスタンス化する際に予めに絞っておく
        return $this->belongsToMany('App\Models\Category')->whereIn('categories.id', [1, 2]);
    }

    public function mainCategory()
    {
        // men's: 1 ladies: 2 を親IDに持つものがメインカテゴリなのでリレーションとしてインスタンス化する際に予めに絞っておく
        return $this->belongsToMany('App\Models\Category')->whereIn('categories.parent_id', [1, 2]);
    }

    public function subCategory()
    {
        // メインカテゴリのIDを配列で取得
        $main_categories = Category::mainCategories()->pluck('id')->toArray();
        // メインカテゴリのIDを親IDに持つものがサブカテゴリなのでリレーションとしてインスタンス化する際に予めに絞っておく
        return $this->belongsToMany('App\Models\Category')->whereIn('categories.parent_id', $main_categories);
    }
}

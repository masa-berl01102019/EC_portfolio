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
    use HasFactory;
    use SoftDeletes;
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

    // An error will occur when inserting data in case that isn't defined timestamps() in migration files
    public $timestamps = false;

    // Setting allowing Mass Assignment  * except columns in the array the below
    protected $guarded = [
        'id'
    ];

    /** Serializing */

    // Setting the date format
    protected $casts = [
        'posted_at' => 'date:Y/m/d H:i',
        'modified_at' => 'date:Y/m/d H:i',
    ];

    // Your own attributes (column names) which you want to include
    protected $appends = ['is_published_text', 'price_text', 'cost_text', 'included_tax_price', 'included_tax_price_text'];

    /** Query scopes */

    public function scopeFilterCategory($query, $request)
    {
        $gender_category = $request->input('f_gender_category');
        $main_category = $request->input('f_main_category');
        $sub_category = $request->input('f_sub_category');
        // $filter should be assigned more specific category IDs 
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
                $receiver_arr = explode(',', $filter);
                return $query->where('categories.id', $receiver_arr);
            });
        });
    }

    public function scopeFilterPriceFrom($query, $request, $tax = 'include')
    {
        $from = $request->input('f_price_from');
        $flag = $from !== null ? true : false;
        $query->when($flag, function ($query) use ($from, $tax) {
            $from_excluding_tax = $tax === 'include' ? (int)$from - intval($from * Tax::getTaxRate()) : (int)$from;
            return $query->where('price', '>=', $from_excluding_tax);
        });
    }

    public function scopeFilterPriceTo($query, $request, $tax = 'include')
    {
        $to = $request->input('f_price_to');
        $flag = $to !== null ? true : false;
        $query->when($flag, function ($query) use ($to, $tax) {
            $to_excluding_tax = $tax === 'include' ? (int)$to - intval($to * Tax::getTaxRate()) : (int)$to;
            return $query->where('price', '<=', $to_excluding_tax);
        });
    }

    public function scopeFilterStock($query, $request)
    {
        $stock_status = $request->input('f_stock_status');

        $flag = $stock_status == config('define.stock_status.in_stock') ? true : false;

        $query->when($flag, function ($query) {
            $skus = Sku::where('quantity', '>', 0)->groupBy('item_id')->pluck('id')->toArray();
            $query->whereHas('skus', function ($query) use ($skus) {
                return $query->whereIn('skus.id', $skus);
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

    /** Static method */

    public static function itemNew()
    {
        // Define items which is posted within 2 months as new arrivals
        $begin = Carbon::today()->subMonth(2);

        return Self::getPublished()->with(['brand', 'categories', 'topImage'])
            ->where('posted_at', '>=', $begin)
            ->orderBy('posted_at', 'desc');
    }

    public static function itemRanking()
    {
        // Aggregation of bookmarked items including unpublished items by items unit * exclude soft deleted items
        $bookmark_quantity = DB::table('skus')
            ->join('bookmarks', 'skus.id', '=', 'bookmarks.sku_id')
            ->select('item_id', DB::raw('count(bookmarks.id) as booked'))
            ->where('skus.deleted_at', null)
            ->groupBy('item_id');

        // Aggregation of cart items including unpublished items by items unit * exclude soft deleted items 
        // * It's not aggregated by quantity of skus
        $cart_quantity = DB::table('skus')
            ->join('carts', 'skus.id', '=', 'carts.sku_id')
            ->select('item_id', DB::raw('count(carts.id) as cart'))
            ->where('skus.deleted_at', null)
            ->groupBy('item_id');

        // Aggregation of ordered items including unpublished items by items unit * exclude soft deleted items
        $order_quantity = DB::table('skus')
            ->join('order_details', 'skus.id', '=', 'order_details.sku_id')
            ->select('item_id', DB::raw('sum(order_details.order_quantity) as ordered'))
            ->where('skus.deleted_at', null)
            ->groupBy('item_id');

        // Apply the above aggregation as sub query by joinSub()
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
        $tag_arr = getRelatedTagId($item_id);
        $category_arr = getRelatedCategoryId($item_id);
        // exclude gender category ID
        array_shift($category_arr);
        // Get similar items 
        $related_item = Self::getPublished()->where('id', '!=', $item_id)
            ->with(['categories', 'tags', 'brand', 'topImage'])
            ->whereHas('categories', function ($query) use ($category_arr) {
                // Get items which is correspond with main category ID or sub category ID
                return $query->whereIn('categories.id', $category_arr);
            })
            ->whereHas('tags', function ($query) use ($tag_arr) {
                // Get items which is correspond with tag ID
                return $query->whereIn('tags.id', $tag_arr);
            })->get();

        foreach ($related_item as $key => $value) {
            // count common item by using array_intersect(), and insert it into collection of $related_item 
            $related_item[$key]['category_similarity'] = count(array_intersect($category_arr, array_column($value['categories']->toArray(), 'id')));
            $related_item[$key]['tag_similarity'] = count(array_intersect($tag_arr, array_column($value['tags']->toArray(), 'id')));
        }

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

    /** Relationships */

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

    /** Conditional Relationships */

    public function publishedBlogs()
    {
        return $this->belongsToMany('App\Models\Blog')->getPublished();
    }

    public function topImage()
    {
        return $this->hasMany('App\Models\Image')->where('image_category', config('define.image_category.main'));
    }

    public function genderCategory()
    {
        return $this->belongsToMany('App\Models\Category')->where('category_type', config('define.category_type.gender'));
    }

    public function mainCategory()
    {
        return $this->belongsToMany('App\Models\Category')->where('category_type', config('define.category_type.main'));
    }

    public function subCategory()
    {
        return $this->belongsToMany('App\Models\Category')->where('category_type', config('define.category_type.sub'));
    }
}

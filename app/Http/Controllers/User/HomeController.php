<?php

namespace App\Http\Controllers\User;

use Throwable;
use App\Models\Blog;
use App\Models\Item;
use App\Models\News;
use App\Models\User;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Http\Resources\BlogResource;
use App\Http\Resources\ItemResource;
use App\Http\Resources\NewsResource;
use Illuminate\Support\Facades\Cookie;
use App\Http\Resources\NotificationResource;

class HomeController extends Controller
{
    private $cookie = null;
    private $recommend_flag = false;

    public function __construct()
    {
        $this->cookie = json_decode(Cookie::get('item_info'));
    }

    public function index(Request $request)
    {
        // TODO: Ranking needs to consider the period of collecting data ex) one week
        // TODO: Needs to implement another recommend algorithm until collecting enough data to apply current one
        try {
            // get Item ID users ordered
            $order_recodes = User::getUserOrderedItemId();
            // get item which user watched from cookie
            $watched_item_arr = $this->cookie ? $this->cookie : [];
            // recommend logic which find users with high similarity and display item which they bought 
            if (!empty($order_recodes) && !empty($watched_item_arr)) {
                // get 4 items from the top of collection
                $item_collection = Item::getRecommendItems($order_recodes, $watched_item_arr, $request)->take(4);
                // display if there are items more than 4
                $this->recommend_flag = count($item_collection) > 3 ? true : false;
                $recommend_items = ItemResource::collection($item_collection);
            }
            // item ranking
            $ranked_items = Item::itemRanking()->filterCategory($request)->limit(4)->get();
            // new arrivals
            $new_items = Item::itemNew()->filterCategory($request)->limit(4)->get();
            // blog
            $blogs = Blog::getPublished()->with(['admin', 'brand', 'tags', 'items'])
                ->filterGenderCategory($request)->orderBy('posted_at', 'desc')->limit(3)->get();
            // news
            $news = News::getPublished()->with(['admin', 'brand', 'tags'])
                ->filterGenderCategory($request)->orderBy('posted_at', 'desc')->limit(3)->get();
            // notification
            $notification = Notification::getPublished()->with('admin')->where('expired_at', '>=', Carbon::now())->limit(2)->get();

            return (ItemResource::collection($new_items))->additional([
                'recommend_items' => $this->recommend_flag ? $recommend_items : ItemResource::collection(
                    Item::getPublished()->with(['brand', 'genderCategory', 'topImage'])->filterCategory($request)->limit(4)->get()
                ),
                'ranked_items' => ItemResource::collection($ranked_items),
                'blogs' => BlogResource::collection($blogs),
                'news' => NewsResource::collection($news),
                'notifications' => NotificationResource::collection($notification)
            ]);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            return response()->json(['status' => config('define.api_status.error'), 'message' => trans('api.user.top.get_err')], 500);
        }
    }
}

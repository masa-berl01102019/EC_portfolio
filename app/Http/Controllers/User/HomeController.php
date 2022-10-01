<?php

namespace App\Http\Controllers\User;

use App\Models\Blog;
use App\Models\Item;
use App\Models\News;
use App\Models\User;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use App\Http\Controllers\Controller;
use App\Http\Resources\BlogResource;
use App\Http\Resources\ItemResource;
use App\Http\Resources\NewsResource;
use Illuminate\Support\Facades\Cookie;
use App\Http\Resources\NotificationResource;

class HomeController extends Controller
{
    // 各種プロパティ
    private $cookie = null;
    private $recommend_flag = false;

    public function __construct()
    {
        // cookieを取得
        $this->cookie = json_decode(Cookie::get('item_info'));
    }

    public function index(Request $request)
    {
        // TODO: ランキングは集計の期間を要検討 1週間?
        // TODO: おすすめを適用するのに十分なデータがない場合のおすすめのアルゴリズム実装必要

        // 購入履歴のあるユーザーの商品IDを取得
        $order_recodes = User::getUserOrderedItemId();
        // ユーザーの視聴履歴をcookieから取得
        $watched_item_arr = $this->cookie ? $this->cookie : [];

        // 購入商品がありもしくは視聴履歴がある場合
        if (!empty($order_recodes) && !empty($watched_item_arr)) {
            // 配列の初期化
            $similar_users = [];
            foreach ($order_recodes as $user_id_key => $order_arr) {
                // 視聴履歴と注文履歴の共通項を配列に格納して要素の数をカウント
                $count = count(array_intersect($watched_item_arr, $order_arr));
                // 視聴履歴と各ユーザーの購入履歴の共通項が1つ以上の物を配列に格納
                if ($count) $similar_users[$user_id_key] = $count;
            }
            // 類似度の高いユーザー順でIDでソート
            arsort($similar_users);
            // ソートしたユーザーのkey(ID)を配列に格納
            $similar_users = array_keys($similar_users);

            //配列を初期化
            $recommend_item_arr = [];
            // ソート順に商品IDを配列にマージしていく
            for ($i = 0; $i < count($similar_users); $i++) {
                $recommend_item_arr = array_merge($recommend_item_arr, $order_recodes[$similar_users[$i]]);
            }
            // 重複を排除
            $recommend_item_arr = array_unique($recommend_item_arr);
            // 配列を初期化
            $recommend_items = [];
            // ソート順に商品を取得
            foreach ($recommend_item_arr as $value) {
                $item = Item::where('id', $value)->getPublished()->with(['brand', 'genderCategory', 'topImage'])->filterCategory($request)->first();
                if (!empty($item)) {
                    $recommend_items[] = new ItemResource($item);
                }
            }
            // 先頭4件を抜き出し * nullの排除と添字の連番を振り直し
            $recommend_items = array_slice(array_values(array_filter($recommend_items)), 0, 4);
            // 4件以上取得出来れば表示
            $this->recommend_flag = count($recommend_items) > 3 ? true : false;
        }

        // 商品ランキング
        $ranked_items = Item::itemRanking()->filterCategory($request)->limit(4)->get();

        // 新着商品
        $new_items = Item::getPublished()->with(['brand', 'genderCategory', 'images'])
            ->filterCategory($request)->orderBy('posted_at', 'desc')->limit(4)->get();
        // ブログ
        $blogs = Blog::getPublished()->with(['admin', 'brand', 'tags', 'items'])
            ->filterGenderCategory($request)->limit(3)->get();
        // ニュース
        $news = News::getPublished()->with(['admin', 'brand', 'tags'])
            ->filterGenderCategory($request)->limit(3)->get();
        // お知らせ
        $notification = Notification::getPublished()->with('admin')->where('expired_at', '>=', Carbon::now())->limit(2)->get();

        // レスポンスを返却
        return (ItemResource::collection($new_items))->additional([
            'recommend_items' => $this->recommend_flag ? $recommend_items : ItemResource::collection(
                Item::getPublished()->with(['brand', 'genderCategory', 'topImage'])->filterCategory($request)->limit(4)->get()
            ),
            'ranked_items' => ItemResource::collection($ranked_items),
            'blogs' => BlogResource::collection($blogs),
            'news' => NewsResource::collection($news),
            'notifications' => NotificationResource::collection($notification)
        ]);
    }
}

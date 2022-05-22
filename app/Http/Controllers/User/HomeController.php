<?php

namespace App\Http\Controllers\User;
use App\Models\Tag;

use App\Models\Blog;
use App\Models\Item;
use App\Models\News;
use App\Models\Size;
use App\Models\User;
use App\Models\Brand;
use App\Models\Color;
use App\Models\Category;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use App\Http\Resources\TagResource;
use App\Http\Controllers\Controller;
use App\Http\Resources\BlogResource;
use App\Http\Resources\ItemResource;
use App\Http\Resources\NewsResource;
use App\Http\Resources\SizeResource;
use App\Http\Resources\BrandResource;
use App\Http\Resources\ColorResource;
use Illuminate\Support\Facades\Cookie;
use App\Http\Resources\NotificationResource;

class HomeController extends Controller
{    
    // 各種フィルター用プロパティ
    private $sizes = null;
    private $colors = null;
    private $tags = null;
    private $brands = null;
    private $gender_categories = null;
    private $main_categories = null;
    private $sub_categories = null;

    private $cookie = null;
    // おすすめ商品を表示するのフラグ
    private $recommend_flag = false;

    public function __construct()
    {
        $this->cookie = json_decode(Cookie::get('item_info'));
        // 各種フィルター用選択肢を取得
        $this->sizes = SizeResource::collection(Size::orderBy('size_name', 'desc')->get());
        $this->colors = ColorResource::collection(Color::orderBy('color_name', 'asc')->get());
        $this->tags = TagResource::collection(Tag::all());
        $this->brands = BrandResource::collection(Brand::orderBy('brand_name', 'asc')->get());
        $this->gender_categories = Category::genderCategories()->get();
        $this->main_categories = Category::mainCategories()->get();
        $this->sub_categories = Category::subCategories()->get();
    }

    public function index(Request $request)
    {
        // TODO: ランキングは集計の期間を要検討 1週間?
        // TODO: おすすめを適用するのに十分なデータがない場合のおすすめのアルゴリズム実装必要

        // 購入履歴のあるユーザーの商品IDを取得
        $order_recodes = User::getUserOrderedItemId();
        // ユーザーの視聴履歴をcookieから取得
        $watched_item_arr = $this->cookie? array_column($this->cookie, 'id') : [];

        // 購入商品がありもしくは視聴履歴がある場合
        if(!empty($order_recodes) && !empty($watched_item_arr)) {
            // 配列の初期化
            $similar_users = [];
            foreach($order_recodes as $user_id_key => $order_arr) {
                // 視聴履歴と注文履歴の共通項を配列に格納して要素の数をカウント
                $count = count(array_intersect($watched_item_arr, $order_arr));
                // 視聴履歴と各ユーザーの購入履歴の共通項が1つ以上の物を配列に格納
                if($count) $similar_users[$user_id_key] = $count;
            }
            // 類似度の高いユーザー順でIDでソート
            arsort($similar_users);
            // ソートしたユーザーのkey(ID)を配列に格納
            $similar_users = array_keys($similar_users);

            //配列を初期化
            $recommend_item_arr = [];
            // ソート順に商品IDを配列にマージしていく
            for($i = 0; $i < count($similar_users); $i++) {
                $recommend_item_arr = array_merge($recommend_item_arr, $order_recodes[$similar_users[$i]]);
            }
            // 重複を排除
            $recommend_item_arr = array_unique($recommend_item_arr);
            // 配列を初期化
            $recommend_items = [];
            // ソート順に商品を取得
            foreach($recommend_item_arr as $value) {
                $item = Item::where('id', $value)->getPublished()->with([ 'brand', 'genderCategory', 'topImage' ])->filterCategory($request)->first();
                if(!empty($item)) {
                    $recommend_items[] = new ItemResource($item);
                }
            }
            // 先頭6件を抜き出し * nullの排除と添字の連番を振り直し
            $recommend_items = array_slice(array_values(array_filter($recommend_items)), 0, 6);
            // 6件以上取得出来れば表示
            $this->recommend_flag = count($recommend_items) > 5 ? true : false;
        } 

        // 商品ランキング
        $ranked_items = Item::itemRanking()->filterCategory($request)->limit(6)->get();
        // 新着商品
        $new_items = Item::getPublished()->with([ 'brand', 'genderCategory', 'images' ])
                        ->filterCategory($request)->orderBy('posted_at', 'desc')->limit(6)->get();
        // ブログ
        $blogs = Blog::getPublished()->with([ 'admin', 'brand', 'tags', 'items' ])
                        ->filterGenderCategory($request)->limit(3)->get();
        // ニュース
        $news = News::getPublished()->with(['admin', 'brand', 'tags'])
                        ->filterGenderCategory($request)->limit(3)->get();
        // お知らせ
        $notification = Notification::getPublished()->with('admin')->where('expired_at', '>=', Carbon::now())->limit(2)->get();

        // レスポンスを返却
        return (ItemResource::collection($new_items))->additional([
            // 各種選択肢をmeta情報としてトップレベルに追加
            'brands' => $this->brands,
            'gender_categories' => $this->gender_categories,
            'main_categories' => $this->main_categories,
            'sub_categories' => $this->sub_categories,
            'sizes' => $this->sizes,
            'colors' => $this->colors,
            'tags' => $this->tags,
            'recommend_items' => $this->recommend_flag ? $recommend_items : ItemResource::collection(
                Item::getPublished()->with([ 'brand', 'genderCategory', 'topImage' ])->filterCategory($request)->limit(6)->get()
            ),
            'ranked_items' => ItemResource::collection($ranked_items),
            'blogs' => BlogResource::collection($blogs),
            'news' => NewsResource::collection($news),
            'notifications' => NotificationResource::collection($notification)
        ]);
    }

}

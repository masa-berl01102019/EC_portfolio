<?php

namespace App\Http\Resources;

use App\Models\Bookmark;
use App\Models\Sku;
use App\Models\Cart;
use App\Models\Size;
use App\Models\Color;
use App\Models\Image;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Resources\Json\JsonResource;

class ItemResource extends JsonResource
{
    /**
     * 適用する「データ」ラッパー
     *
     * @var string
     */
    public static $wrap = 'item';

    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        // 受信リクエストが名前付きルートに一致するかを判定
        if($request->routeIs('user.home.index') || $request->routeIs('user.items.index') || $request->routeIs('user.items.rank') || $request->routeIs('user.items.recommend')) {
            return [
                'id' => $this->id,
                'item_name' => $this->item_name,
                'included_tax_price_text' => $this->included_tax_price_text,
                'top_image' => !$this->topImage->isEmpty() ? $this->topImage->first()->image: null,
                'brand_name' => optional($this->brand)->brand_name
            ];
        } else if ($request->routeIs('user.items.show')) {
            // 商品に紐づくカラーIDを配列で取得
            $item_colors = uniqueArray($this->skus->pluck('color_id')->toArray());
            // カート追加/ブックマーク追加時のモーダル表示用の配列を初期化
            $arr = [];
            // データの整形
            for($i = 0; $i < count($item_colors); $i++) {
                $arr[$i]['color_name'] = Color::find($item_colors[$i])->color_name;
                $arr[$i]['img'] = optional(Image::where('item_id', $this->id)->where('color_id', $item_colors[$i])->first())->image;
                $arr[$i]['sizes'] = Sku::where('item_id', $this->id)->where('color_id', $item_colors[$i])->orderBy('size_id')->select('quantity', 'size_id', 'id')->get()->toArray();
            }
            $user_id = optional(Auth::guard('user')->user())->id;
            // 同一ユーザーのカート商品のSKUのIDを配列で取得
            $cart_item_arr = Cart::getUserCart($user_id);
            // 同一ユーザーのブックマーク商品のSKUのIDを配列で取得
            $bookmark_item_arr = Bookmark::getUserBookmark($user_id);
            return [
                'id' => $this->id,
                'product_number' => $this->product_number,
                'item_name' => $this->item_name,
                'included_tax_price_text' => $this->included_tax_price_text,
                'made_in' => $this->made_in,
                'mixture_ratio' => $this->mixture_ratio,
                'description' => $this->description,
                'brand_name' => optional($this->brand)->brand_name,
                'measurements' => MeasurementResource::collection($this->measurements),
                'color_variation' => Color::whereIn('id', uniqueArray($this->skus->pluck('color_id')->toArray()))->pluck('color_name'),
                'size_variation' => Size::whereIn('id', uniqueArray($this->skus->pluck('size_id')->toArray()))->pluck('size_name'),
                'gender_category' => !$this->genderCategory->isEmpty() ? $this->genderCategory->first()->category_name: null,
                'main_category' => !$this->mainCategory->isEmpty() ? $this->mainCategory->first()->category_name: null,
                'sub_category' => !$this->subCategory->isEmpty() ? $this->subCategory->first()->category_name: null,
                'top_image' => !$this->topImage->isEmpty() ? $this->topImage->first()->image: null,
                'images' => ImageResource::collection($this->images),
                'skus' => $arr, // bookmarkとcartのモーダル表示用
                'cart_items' =>  $cart_item_arr, // cartにも入ってるか？
                'bookmark_items' => $bookmark_item_arr, // bookmarkにも入ってるか？
                'publishedBlogs' => !$this->publishedBlogs->isEmpty() ? BlogResource::collection($this->publishedBlogs): null, // 商品に紐づいたブログ
            ];
        } else if ($request->routeIs('admin.items.edit')) {
            return [
                'product_number' => $this->product_number,
                'item_name' => $this->item_name,
                'price' => $this->price,
                'cost' => $this->cost,
                'made_in' => $this->made_in,
                'mixture_ratio' => $this->mixture_ratio,
                'description' => $this->description,
                'is_published' => $this->is_published,
                'brand_id' => $this->brand_id,
                'gender_category' => !$this->genderCategory->isEmpty() ? $this->genderCategory->first()->id: null,
                'main_category' => !$this->mainCategory->isEmpty() ? $this->mainCategory->first()->id: null,
                'sub_category' => !$this->subCategory->isEmpty() ? $this->subCategory->first()->id: null,
                'sizes_id' => uniqueArray($this->skus->pluck('size_id')->toArray()), 
                'colors_id' => uniqueArray($this->skus->pluck('color_id')->toArray()),
                'tags_id' => $this->tags->pluck('id'),
                'images' => ImageResource::collection($this->images),
                'measurements' => MeasurementResource::collection($this->measurements),
                'skus' => SkuResource::collection($this->skus)
            ];
        } else {
            return [
                'id' => $this->id,
                'is_published_text' => $this->is_published_text,
                'product_number' => $this->product_number,
                'item_name' => $this->item_name,
                'price_text' => $this->price_text,
                'cost_text' => $this->cost_text,
                'color_variation' => Color::whereIn('id', uniqueArray($this->skus->pluck('color_id')->toArray()))->pluck('color_name'),
                'size_variation' => Size::whereIn('id', uniqueArray($this->skus->pluck('size_id')->toArray()))->pluck('size_name'),
                'made_in' => $this->made_in,
                'mixture_ratio' => $this->mixture_ratio,
                'brand_name' => optional($this->brand)->brand_name,
                'gender_category' => !$this->genderCategory->isEmpty() ? $this->genderCategory->first()->category_name: null,
                'main_category' => !$this->mainCategory->isEmpty() ? $this->mainCategory->first()->category_name: null,
                'sub_category' => !$this->subCategory->isEmpty() ? $this->subCategory->first()->category_name: null,
                'tags' => $this->tags->pluck('tag_name'),
                'full_name' => optional($this->admin)->full_name,
                'full_name_kana' => optional($this->admin)->full_name_kana,
                'posted_at' => $this->posted_at !== null ? $this->posted_at->format('Y/m/d H:i') : null,
                'modified_at' => $this->modified_at !== null ? $this->modified_at->format('Y/m/d H:i') : null
            ];
        }

    } 
    
}

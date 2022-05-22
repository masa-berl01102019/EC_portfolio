<?php

namespace App\Http\Resources;

use App\Models\Cart;
use App\Models\Size;
use App\Models\Color;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Resources\Json\JsonResource;

class BookmarkResource extends JsonResource
{
    /**
     * 適用する「データ」ラッパー
     *
     * @var string
     */
    public static $wrap = 'bookmark';

    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        // 同一ユーザーのカート商品のSKUのIDを配列で取得
        $cart_item_arr = Cart::getUserCart(optional(Auth::guard('user')->user())->id);

        return [
            'id' => $this->id,
            'sku_id' => $this->sku_id,
            'cart_status' => in_array($this->sku_id, $cart_item_arr) ? 1 : 0, // cartにも入ってるか？
            'stock_status' => $this->sku->quantity > 0 ? 1 : 0, // 在庫状況
            'item_id' => $this->item_id,
            'size_name' => Size::where('id', $this->size_id)->first()->size_name,
            'color_name' => Color::where('id', $this->color_id)->first()->color_name,
            'item_name' => $this->item_name,
            'included_tax_price_text' => $this->included_tax_price_text,
            'brand_name' => $this->brand_name,
            'top_image' => $this->sku->item->topImage->first()->image,
        ];
    } 
    
}

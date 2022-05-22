<?php

namespace App\Http\Resources;

use App\Models\Cart;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderDetailResource extends JsonResource
{
    /**
     * 適用する「データ」ラッパー
     *
     * @var string
     */
    public static $wrap = 'order_detail';

    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        // 受信リクエストが名前付きルートに一致するかを判定
        if($request->routeIs('user.orders.index')) {

            // 同一ユーザーのカート商品のSKUのIDを配列で取得
            $cart_item_arr = Cart::getUserCart(optional(Auth::guard('user')->user())->id);

            return [
                'id' => $this->id,
                'item_id' => optional($this->sku->item)->id,
                'top_image' => !$this->sku->item->topImage->isEmpty() ? $this->sku->item->topImage->first()->image: null,
                'stock_status' => $this->sku->quantity > 0 ? 1 : 0, // 在庫状況
                'brand_name' => optional($this->sku->item->brand)->brand_name,
                'item_name' => $this->item_name,
                'order_price_text' => $this->order_price_text,
                'order_color' => $this->order_color,
                'order_size' => $this->order_size,
                'created_at' => $this->created_at->format('Y/m/d'),
                'cart_status' => in_array($this->sku_id, $cart_item_arr) ? 1 : 0, // cartにも入ってるか？
                'sku_id' => $this->sku_id,
                'order_quantity' => $this->order_quantity
            ];
        } else if ($request->routeIs('admin.orders.edit')) {
            return [
                'id' => $this->id,
                'item_name' => $this->item_name,
                'product_number' => $this->product_number,
                'order_price' => $this->order_price,
                'order_color' => $this->order_color,
                'order_size' => $this->order_size,
                'order_quantity' => $this->order_quantity,
            ];
        } else {
            return [
                'id' => $this->id,
                'item_name' => $this->item_name,
                'product_number' => $this->product_number,
                'order_price' => $this->order_price,
                'order_color' => $this->order_color,
                'order_size' => $this->order_size,
                'order_quantity' => $this->order_quantity,
            ];
        }
    } 
    
}

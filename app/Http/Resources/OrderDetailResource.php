<?php

namespace App\Http\Resources;

use App\Models\Sku;
use App\Models\Cart;
use App\Models\Item;
use App\Models\Image;
use Illuminate\Support\Facades\Auth;
use phpDocumentor\Reflection\Types\Boolean;
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
        if ($request->routeIs('user.orders.index')) {

            // 同一ユーザーのカート商品のSKUのIDを配列で取得
            $cart_item_arr = Cart::getUserCart(optional(Auth::guard('user')->user())->id);

            // 論理削除されたものも取得
            $sku = Sku::withTrashed()->find($this->sku_id);
            $item = Item::withTrashed()->find($sku->item_id);

            $imeges = Image::where('image_category', 0)->where('item_id', $item->id)->pluck('image')->toArray();

            return [
                'id' => $this->id,
                'item_id' => optional($item)->id,
                'top_image' => !empty($imeges) ? $imeges[0] : null,
                'brand_name' => optional($item->brand)->brand_name,
                'item_name' => $this->item_name,
                'order_price_text' => $this->order_price_text,
                'order_color' => $this->order_color,
                'order_size' => $this->order_size,
                'created_at' => $this->created_at->format('Y/m/d'),
                'stock_status' => optional($sku)->quantity > 0 ? 1 : 0, // 在庫状況
                'cart_status' => in_array($this->sku_id, $cart_item_arr) ? 1 : 0, // cartにも入ってるか？
                'delete_status' => optional($sku)->deleted_at || optional($item)->deleted_at ? 1 : 0, // 削除になってるか？
                'is_published' => optional($item)->is_published, // 0: 未公開 1: 公開
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

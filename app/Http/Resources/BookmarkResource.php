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
        $cart_item_arr = Cart::getUserCart(optional(Auth::guard('user')->user())->id);

        return [
            'id' => $this->id,
            'sku_id' => $this->sku_id,
            'cart_status' => in_array($this->sku_id, $cart_item_arr) ? 1 : 0, // check if it's in cart
            'stock_status' => $this->sku->quantity > 0 ? 1 : 0,
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

<?php

namespace App\Http\Resources;

use App\Models\Size;
use App\Models\Color;
use Illuminate\Http\Resources\Json\JsonResource;

class CartResource extends JsonResource
{
    /**
     *
     * @var string
     */
    public static $wrap = 'cart';

    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'sku_id' => $this->sku_id,
            'stock_status' => $this->sku->quantity > 0 ? config('define.stock_status.in_stock') : config('define.stock_status.sold_out'),
            'stock' => $this->sku->quantity,
            'item_id' => $this->item_id,
            'size_name' => Size::where('id', $this->size_id)->first()->size_name,
            'color_name' => Color::where('id', $this->color_id)->first()->color_name,
            'item_name' => $this->item_name,
            'included_tax_price_text' => $this->included_tax_price_text,
            'included_tax_price' => $this->included_tax_price,
            'quantity' => $this->quantity,
            'top_image' => $this->sku->item->topImage->first()->image,
            'brand_name' => $this->sku->item->brand->brand_name,
        ];
    }
}

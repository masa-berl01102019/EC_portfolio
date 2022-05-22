<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class RelatedItemResource extends JsonResource
{
    /**
     * 適用する「データ」ラッパー
     *
     * @var string
     */
    public static $wrap = 'related_item';

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
            'item_name' => $this->item_name,
            'included_tax_price_text' => $this->included_tax_price_text,
            'top_image' => !$this->topImage->isEmpty() ? $this->topImage->first()->image: null,
            'brand_name' => optional($this->brand)->brand_name,
            'category_similarity' => $this->category_similarity,
            'tag_similarity' => $this->tag_similarity
        ];
    } 
    
}

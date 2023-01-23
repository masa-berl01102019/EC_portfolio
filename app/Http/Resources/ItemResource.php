<?php

namespace App\Http\Resources;

use App\Models\Size;
use App\Models\Color;
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

        // URLにeditが含まれるか判定
        $str = strstr($request->url(), 'edit');
        // editかどうかで条件分岐
        if($str === 'edit') {
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

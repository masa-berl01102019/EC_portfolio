<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ImageResource extends JsonResource
{
    /**
     *
     * @var string
     */
    public static $wrap = 'image';

    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        if ($request->routeIs('user.items.show')) {
            return [
                'image' => $this->image
            ];
        } else {
            return [
                'id' => $this->id,
                'item_id' => $this->item_id,
                'color_id' => $this->color_id,
                'image' => $this->image,
                'image_category' => $this->image_category,
            ];
        }
    }
}

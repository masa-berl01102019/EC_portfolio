<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class MeasurementResource extends JsonResource
{
    /**
     *
     * @var string
     */
    public static $wrap = 'measurement';

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
            'item_id' => $this->item_id,
            'size_id' => $this->size_id,
            'width' => $this->width,
            'shoulder_width' => $this->shoulder_width,
            'raglan_sleeve_length' => $this->raglan_sleeve_length,
            'sleeve_length' => $this->sleeve_length,
            'length' => $this->length,
            'waist' => $this->waist,
            'hip' => $this->hip,
            'rise' => $this->rise,
            'inseam' => $this->inseam,
            'thigh_width' => $this->thigh_width,
            'outseam' => $this->outseam,
            'sk_length' => $this->sk_length,
            'hem_width' => $this->hem_width,
            'weight' => $this->weight,
        ];
    }
}

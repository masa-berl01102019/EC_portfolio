<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    /**
     * 適用する「データ」ラッパー
     *
     * @var string
     */
    public static $wrap = 'order';

    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        // 受信リクエストが名前付きルートに一致するかを判定
        if($request->routeIs('admin.orders.edit')) {
            return [
                'is_paid' => $this->is_paid,
                'is_shipped' => $this->is_shipped,
                'sub_total_text' => $this->sub_total_text,
                'tax_amount_text' => $this->tax_amount_text,
                'total_amount_text' => $this->total_amount_text,
                'delivery_date' => $this->delivery_date,
                'delivery_time' => $this->delivery_time,
                'order_details' => OrderDetailResource::collection($this->orderDetails),
            ];
        } else {
            return [
                'id' => $this->id,
                'created_at' => $this->created_at->format('Y/m/d H:i'),
                'total_amount_text' => $this->total_amount_text,
                'payment_method_text' => $this->payment_method_text,
                'is_paid_text' => $this->is_paid_text,
                'is_shipped_text' => $this->is_shipped_text,
                'full_name' => optional($this->user)->full_name,
                'full_name_kana' => optional($this->user)->full_name_kana,
                'tel' => optional($this->user)->tel,
                'delivery_post_code_text' => optional($this->user)->delivery_post_code_text,
                'post_code_text' => optional($this->user)->post_code_text,
                'full_delivery_address' => optional($this->user)->full_delivery_address,
                'full_address' => optional($this->user)->full_address,
                'email' => optional($this->user)->email,
                'updated_at' => $this->updated_at->format('Y/m/d H:i'),
                'delivery_date' => $this->delivery_date,
                'delivery_time' => $this->delivery_time
            ];
        }

    } 
    
}

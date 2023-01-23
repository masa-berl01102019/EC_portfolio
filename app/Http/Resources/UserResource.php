<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * 適用する「データ」ラッパー
     *
     * @var string
     */
    public static $wrap = 'user';

    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        if ($request->routeIs('admin.users.edit') || $request->routeIs('user.users.edit')) {
            return [
                'id' => $this->id,
                'last_name' =>  $this->last_name,
                'first_name' =>  $this->first_name,
                'last_name_kana' =>  $this->last_name_kana,
                'first_name_kana' =>  $this->first_name_kana,
                'gender' =>  $this->gender,
                'birthday' =>  $this->birthday,
                'post_code' =>  $this->post_code,
                'prefecture' =>  $this->prefecture,
                'municipality' =>  $this->municipality,
                'street_name' =>  $this->street_name,
                'street_number' =>  $this->street_number,
                'building' =>  $this->building,
                'delivery_post_code' =>  $this->delivery_post_code,
                'delivery_prefecture' =>  $this->delivery_prefecture,
                'delivery_municipality' =>  $this->delivery_municipality,
                'delivery_street_name' =>  $this->delivery_street_name,
                'delivery_street_number' =>  $this->delivery_street_number,
                'delivery_building' =>  $this->delivery_building,
                'tel' =>  $this->tel,
                'email' =>  $this->email,
                // 'password' =>  $this->password, TODO: パスワードの変更時の要件を整理して実装する
                'is_received' =>  $this->is_received,
            ];
        } else {
            return [
                'id' => $this->id,
                'full_name' => $this->full_name,
                'full_name_kana' => $this->full_name_kana,
                'gender_text' => $this->gender_text,
                'birthday' => $this->birthday->format('Y/m/d'),
                'post_code_text' => $this->post_code_text,
                'full_address' => $this->full_address,
                'delivery_post_code_text' => $this->delivery_post_code_text,
                'full_delivery_address' => $this->full_delivery_address,
                'tel' => $this->tel,
                'email' => $this->email,
                'is_received_text' => $this->is_received_text,
                'created_at' => $this->created_at->format('Y/m/d H:i'),
                'updated_at' => $this->updated_at->format('Y/m/d H:i'),
            ];
        }

    } 
    
}

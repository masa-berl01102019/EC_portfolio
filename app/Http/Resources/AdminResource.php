<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class AdminResource extends JsonResource
{
    /**
     * 適用する「データ」ラッパー
     *
     * @var string
     */
    public static $wrap = 'admin';

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
                'last_name' =>  $this->last_name,
                'first_name' =>  $this->first_name,
                'last_name_kana' =>  $this->last_name_kana,
                'first_name_kana' =>  $this->first_name_kana,
                'tel' =>  $this->tel,
                'email' =>  $this->email
            ];
        } else {
            return [
                'id' => $this->id,
                'full_name' => $this->full_name,
                'full_name_kana' => $this->full_name_kana,
                'tel' => $this->tel,
                'email' => $this->email,
                'created_at' => $this->created_at->format('Y/m/d H:i'),
                'updated_at' => $this->updated_at->format('Y/m/d H:i')
            ];
        }

    } 
    
}

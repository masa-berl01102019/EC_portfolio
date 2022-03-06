<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ContactResource extends JsonResource
{
    /**
     * 適用する「データ」ラッパー
     *
     * @var string
     */
    public static $wrap = 'contact';

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
                'title' => $this->title,
                'body' => $this->body,
                'full_name' => $this->full_name,
                'full_name_kana' => $this->full_name_kana,
                'tel' => $this->tel,
                'email' => $this->email,
                'response_status' => $this->response_status,
                'memo' => $this->memo,
                'created_at' => $this->created_at->format('Y/m/d H:i'),
            ];
        } else {
            return [
                'id' => $this->id,
                'user_id' => $this->user_id,
                'title' => $this->title,
                'body' => $this->body,
                'full_name' => $this->full_name,
                'full_name_kana' => $this->full_name_kana,
                'tel' => $this->tel,
                'email' => $this->email,
                'response_status_text' => $this->response_status_text,
                'admin_full_name' => optional($this->admin)->full_name,
                'admin_full_name_kana' => optional($this->admin)->full_name_kana,
                'memo' => $this->memo,
                'created_at' => $this->created_at->format('Y/m/d H:i'),
                'updated_at' => $this->updated_at !== null ? $this->updated_at->format('Y/m/d H:i') : null
            ];
        }
    } 
    
}

<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ErrorResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        // バリデーションエラーメッセージを取得
        $arr = $this->errors();
        // 配列を取得
        $new_arr = [];
        // for文で展開
        foreach($arr as $key => $value) {
            // 連想配列内のバリデーション
            if(strpos($key, '.')) {
                // 「.」区切りのkeyを配列に変換
                $key_arr = explode('.',$key);
                if(array_key_exists($key_arr[0], $new_arr) && !empty($key_arr[2])) { // 整形する配列内に重複したkey名があるかつkey名が2つある場合で条件分岐
                    $new_arr[$key_arr[0]][$key_arr[2]] = implode($value);
                } else if (count($key_arr) < 3) { // key名から生成した配列が2つ以下の場合で条件分岐
                    $new_arr[$key_arr[0]] = implode($value);
                } else {
                    // 新しいkey名で連想配列を代入
                    $new_arr[$key_arr[0]] = [$key_arr[2] => implode($value)];
                }
            } else {
                // keyを指定して配列を文字列に変換して代入
                $new_arr[$key] = implode($value);
            }
        }
    
        return [
            'errCode' => 'Unprocessable Entity',
            'errMessage' => $new_arr
        ];
    } 
    
}

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
        // Get validaton error message
        $arr = $this->errors();

        $new_arr = [];

        foreach ($arr as $key => $value) {
            if (strpos($key, '.')) {
                $key_arr = explode('.', $key);
                if (array_key_exists($key_arr[0], $new_arr) && !empty($key_arr[2])) {
                    $new_arr[$key_arr[0]][$key_arr[2]] = implode($value);
                } else if (count($key_arr) < 3) {
                    $new_arr[$key_arr[0]] = implode($value);
                } else {
                    $new_arr[$key_arr[0]] = [$key_arr[2] => implode($value)];
                }
            } else {
                $new_arr[$key] = implode($value);
            }
        }

        return [
            'errCode' => 'Unprocessable Entity',
            'errMessage' => $new_arr
        ];
    }
}

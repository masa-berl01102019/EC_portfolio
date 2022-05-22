<?php

namespace App\Http\Requests\User;

use App\Rules\Kana;
use App\Rules\JapanesePhoneNumber;
use Illuminate\Foundation\Http\FormRequest;

class OrderRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {

        return [ 
            'id' => 'required|string',
            'total_amount' => 'required|integer|min:0',
            'payment_method' => 'required|integer|min:0|max:1',
            'delivery_date' => 'required|date',
            'delivery_time' => 'required|string|max:30' 
        ];
    }

    public function attributes()
    {
        return [
            'id' => '決済トークン', 
            'total_amount' => '請求合計', 
            'payment_method' => '支払い方法', 
            'delivery_date' => 'ご希望配達日', 
            'delivery_time' => 'ご希望配達時間帯'
        ];
    }
}

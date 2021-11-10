<?php

namespace App\Http\Requests\admin;

use Illuminate\Foundation\Http\FormRequest;

class ItemEditRequest extends FormRequest
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
            'product_number' => 'required|string|max:50',
            'item_name' => 'required|string|max:100',
            'price' => 'required|integer',
            'cost' => 'required|integer',
            'made_in' => 'required|string|max:80',
            'mixture_ratio' => 'required|string|max:255',
            'description' => 'required|string',
            'is_published' => 'required|integer|min:0|max:1',
            'brand_id' => 'required|integer',
        ];
    }

    public function attributes()
    {
        return [
            'product_number' => '品番',
            'item_name' => '商品名',
            'price' => '価格',
            'cost' => '原価',
            'made_in' => '生産国',
            'mixture_ratio' => '混用率',
            'description' => '商品説明',
            'is_published' => '公開設定',
            'brand_id' => 'ブランド',
        ];
    }
}

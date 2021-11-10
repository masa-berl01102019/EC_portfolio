<?php

namespace App\Http\Requests\admin;

use Illuminate\Foundation\Http\FormRequest;

class ItemSkuEditRequest extends FormRequest
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
            'skus.*.size_id' => 'required|integer',
            'skus.*.color_id' => 'required|integer',
            'skus.*.quantity' => 'nullable|integer',
        ];
    }

    public function attributes()
    {
        return [
            'skus.*.size_id' => 'サイズ',
            'skus.*.color_id' => 'カラー',
            'skus.*.quantity' => '在庫数',
        ];
    }
}

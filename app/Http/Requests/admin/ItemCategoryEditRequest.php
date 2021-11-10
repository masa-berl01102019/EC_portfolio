<?php

namespace App\Http\Requests\admin;

use Illuminate\Foundation\Http\FormRequest;

class ItemCategoryEditRequest extends FormRequest
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
            'brand_id' => 'required|integer',
            'gender_category' => 'required|integer',
            'main_category' => 'required|integer',
            'sub_category' => 'required|integer',
        ];
    }

    public function attributes()
    {
        return [
            'brand_id' => 'ブランド',
            'gender_category' => '性別カテゴリ',
            'main_category' => 'メインカテゴリ',
            'sub_category' => 'サブカテゴリ',
        ];
    }
}

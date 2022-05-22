<?php

namespace App\Http\Requests\user;

use Illuminate\Foundation\Http\FormRequest;

class CartRegisterRequest extends FormRequest
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
            'sku_id' => 'required|integer'
        ];
    }

    public function attributes()
    {
        return [
            'sku_id' => 'SKU ID'
        ];
    }
}

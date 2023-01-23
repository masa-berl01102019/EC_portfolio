<?php

namespace App\Http\Requests\admin;

use Illuminate\Foundation\Http\FormRequest;

class OrderEditRequest extends FormRequest
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
            'is_paid' => 'required|integer|min:0|max:1',
            'is_shipped' => 'required|integer|min:0|max:1'
        ];
    }

    public function attributes()
    {
        return [
            'is_paid' => '入金状況',
            'is_shipped' => '出荷状況'
        ];
    }
}

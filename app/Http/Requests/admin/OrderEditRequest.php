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
            'is_shipped' => 'required|integer|min:0|max:1',
            'delivery_date' => 'required|date',
            'delivery_time' => 'required|string|max:30'
        ];
    }
}

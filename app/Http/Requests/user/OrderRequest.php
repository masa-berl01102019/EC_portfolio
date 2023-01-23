<?php

namespace App\Http\Requests\User;

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
            'payment_token' => 'required|string|max:255',
            'total_amount' => 'required|integer|min:0',
            'payment_method' => 'required|integer|min:0|max:1',
            'delivery_date' => 'required|date|after:today',
            'delivery_time' => 'required|string|max:30'
        ];
    }
}

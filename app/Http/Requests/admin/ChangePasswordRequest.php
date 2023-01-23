<?php

namespace App\Http\Requests\admin;

use Illuminate\Foundation\Http\FormRequest;


class ChangePasswordRequest extends FormRequest
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
            'uuid' => 'required|string',
            'password' => 'required|string|alpha_num|min:8|max:100'
        ];
    }
}

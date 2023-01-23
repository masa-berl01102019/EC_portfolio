<?php

namespace App\Http\Requests\admin;

use App\Rules\JapanesePhoneNumber;
use App\Rules\Kana;
use Illuminate\Foundation\Http\FormRequest;

class AdminRegisterRequest extends FormRequest
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
            'last_name' => 'required|string|max:25',
            'first_name' => 'required|string|max:25',
            'last_name_kana' => ['nullable', 'string', 'max:25', new Kana],
            'first_name_kana' => ['nullable', 'string', 'max:25', new Kana],
            'tel' => ['required', 'string', new JapanesePhoneNumber, 'max:15'],
            'email' => 'required|email:strict,dns,spoof|max:100|unique:admins',
            'password' => 'required|string|alpha_num|min:8|max:100'
        ];
    }
}

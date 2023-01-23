<?php

namespace App\Http\Requests\user;

use App\Rules\JapanesePhoneNumber;
use App\Rules\JapanesePostCode;
use App\Rules\Kana;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UserRegisterRequest extends FormRequest
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
            'last_name_kana' => ['nullable', 'required', 'string', 'max:25', new Kana],
            'first_name_kana' => ['nullable', 'required', 'string', 'max:25', new Kana],
            'gender' => 'required|integer|min:0|max:3',
            'birthday' => 'required|date',
            'post_code' => ['required', 'string', new JapanesePostCode, 'max:10'],
            'prefecture' => 'required|string|max:50',
            'municipality' => 'required|string|max:50',
            'street_name' => 'required|string|max:50',
            'street_number' => 'required|string|max:50',
            'building' => 'nullable|string|max:50',
            'delivery_post_code' => ['nullable', 'string', new JapanesePostCode, 'max:10'],
            'delivery_prefecture' => 'nullable|string|max:50',
            'delivery_municipality' => 'nullable|string|max:50',
            'delivery_street_name' => 'nullable|string|max:50',
            'delivery_street_number' => 'nullable|string|max:50',
            'delivery_building' => 'nullable|string|max:50',
            'tel' => ['required', 'string', new JapanesePhoneNumber, 'max:15'],
            'email' => 'required|email:strict,dns,spoof|max:100|unique:users',
            'password' => 'required|string|alpha_num|min:8|max:100',
            'is_received' => 'required|integer|min:0|max:1'
        ];
    }
}

<?php

namespace App\Http\Requests\User;

use App\Rules\Kana;
use App\Rules\JapanesePhoneNumber;
use Illuminate\Foundation\Http\FormRequest;

class ContactRequest extends FormRequest
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
            'email' => 'required|email:strict,dns,spoof|max:100',
            'subject' => 'required|string|max:255',
            'message' => 'required|string'
        ];
    }

    public function attributes()
    {
        return [
            'last_name' => '姓',
            'first_name' => '名',
            'last_name_kana' => '姓(カナ)',
            'first_name_kana' => '名(カナ)',
            'tel' => '電話番号',
            'email' => 'メールアドレス',
            'subject' => '件名',
            'message' => '本文',
        ];
    }
}

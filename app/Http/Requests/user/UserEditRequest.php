<?php

namespace App\Http\Requests\user;

use App\Rules\JapanesePhoneNumber;
use App\Rules\JapanesePostCode;
use App\Rules\Kana;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UserEditRequest extends FormRequest
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
            'last_name_kana' => ['required', 'string', 'max:25', new Kana],
            'first_name_kana' => ['required', 'string', 'max:25', new Kana],
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
            'email' => [
                'required',
                'string',
                'email:strict,dns,spoof',
                'max:100',
                Rule::unique('users')->ignore($this->id), // 該当ID以外でユニークを適用
            ], // unique:table名でテーブル内での値がユニークかチェック * dns:ドメインが存在するアドレスか? / strict: RFCに違反するアドレスか? / spoof: なりすましメールか?チェック
            'is_received' => 'required|integer|min:0|max:1',
        ];
    }

    public function attributes()
    {
        return [
            'last_name' => '姓',
            'first_name' => '名',
            'last_name_kana' => '姓(カナ)',
            'first_name_kana' => '名(カナ)',
            'gender' => '性別',
            'birthday' => '誕生日',
            'post_code' => '郵便番号',
            'prefecture' => '都道府県',
            'municipality' => '市区町村郡',
            'street_name' => '町名',
            'street_number' => '丁目番地',
            'building' => '建物名',
            'delivery_post_code' => '郵便番号(配達先)',
            'delivery_prefecture' => '都道府県(配達先)',
            'delivery_municipality' => '市区町村郡(配達先)',
            'delivery_street_name' => '町名(配達先)',
            'delivery_street_number' => '町目番地(配達先)',
            'delivery_building' => '建物名(配達先)',
            'tel' => '電話番号',
            'email' => 'メールアドレス',
            'is_received' => 'DM送付',
        ];
    }
}

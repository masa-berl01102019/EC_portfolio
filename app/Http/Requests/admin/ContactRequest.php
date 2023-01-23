<?php

namespace App\Http\Requests\admin;

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
            'response_status' => 'required|numeric|min:0|max:2',
            'memo' => 'nullable|string',
        ];
    }

    public function attributes()
    {
        return [
            'response_status' => '対応状況',
            'memo' => '備考欄',
        ];
    }
}

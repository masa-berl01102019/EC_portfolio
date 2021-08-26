<?php

namespace App\Http\Requests\admin;

use Illuminate\Foundation\Http\FormRequest;

class NotificationRequest extends FormRequest
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
            'title' => 'required|string|max:255',
            'body' => 'required|string',
            'is_published' => 'required|numeric|min:0|max:1',
            'expired_at' => 'nullable|date',
        ];
    }

    public function attributes()
    {
        return [
            'title' => 'タイトル',
            'body' => '本文',
            'is_published' => '公開設定',
            'expired_at' => '掲載終了日',
        ];
    }
}

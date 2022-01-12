<?php

namespace App\Http\Requests\admin;

use Illuminate\Foundation\Http\FormRequest;

class BlogEditRequest extends FormRequest
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
            'brand_id' => 'required|integer',
            'category_id' => 'required|integer',
            'items_id.*' => 'nullable|integer',
            'tags_id.*' => 'nullable|integer',
            'is_published' => 'required|integer|min:0|max:1',
            'file' => 'nullable|file|image|mimes:png,jpeg,jpg,svg,svgz|max:1024',
            'thumbnail' => 'required|string|max:255'
        ];
    }

    public function attributes()
    {
        return [
            'title' => 'タイトル',
            'body' => '本文',
            'brand_id' => 'ブランドカテゴリ',
            'category_id' => '性別カテゴリ',
            'items_id.*' => '関連品番',
            'tags_id.*' => 'タグ',
            'is_published' => '公開設定',
            'file' => 'サムネイル画像',
            'thumbnail' => 'サムネイル画像'
        ];
    }
}

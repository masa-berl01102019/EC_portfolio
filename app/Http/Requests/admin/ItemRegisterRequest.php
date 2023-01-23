<?php

namespace App\Http\Requests\admin;

use Illuminate\Foundation\Http\FormRequest;

class ItemRegisterRequest extends FormRequest
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
            'product_number' => 'required|string|max:50',
            'item_name' => 'required|string|max:100',
            'price' => 'required|integer',
            'cost' => 'required|integer',
            'made_in' => 'required|string|max:80',
            'mixture_ratio' => 'required|string|max:255',
            'description' => 'required|string',
            'is_published' => 'required|integer|min:0|max:1',
            'brand_id' => 'required|integer',
            'gender_category' => 'required|integer',
            'main_category' => 'required|integer',
            'sub_category' => 'required|integer',
            'tags_id.*' => 'nullable|integer',
            'skus.*.size_id' => 'required|integer',
            'skus.*.color_id' => 'required|integer',
            'skus.*.quantity' => 'nullable|integer',
            'images.*.color_id' => 'required|integer',
            'images.*.image' => 'required|string|max:255',
            'images.*.image_category' => 'required|integer|min:0|max:1',
            'images.*.file' => 'nullable|file|image|mimes:png,jpeg,jpg,svg,svgz|max:1024', 
            'measurements.*.size_id' => 'required|integer',
            'measurements.*.width' => 'nullable|numeric',
            'measurements.*.shoulder_width' => 'nullable|numeric',
            'measurements.*.raglan_sleeve_length' => 'nullable|numeric',
            'measurements.*.sleeve_length' => 'nullable|numeric',
            'measurements.*.length' => 'nullable|numeric',
            'measurements.*.waist' => 'nullable|numeric',
            'measurements.*.hip' => 'nullable|numeric',
            'measurements.*.rise' => 'nullable|numeric',
            'measurements.*.inseam' => 'nullable|numeric',
            'measurements.*.thigh_width' => 'nullable|numeric',
            'measurements.*.outseam' => 'nullable|numeric',
            'measurements.*.sk_length' => 'nullable|numeric',
            'measurements.*.hem_width' => 'nullable|numeric',
            'measurements.*.weight' => 'nullable|numeric',
        ];
    }

    public function attributes()
    {
        return [
            'product_number' => '品番',
            'item_name' => '商品名',
            'price' => '価格',
            'cost' => '原価',
            'made_in' => '生産国',
            'mixture_ratio' => '混用率',
            'description' => '商品説明',
            'is_published' => '公開設定',
            'brand_id' => 'ブランド',
            'gender_category' => '性別カテゴリ',
            'main_category' => 'メインカテゴリ',
            'sub_category' => 'サブカテゴリ',
            'tags_id.*' => 'タグ',
            'skus.*.size_id' => 'サイズ',
            'skus.*.color_id' => 'カラー',
            'skus.*.quantity' => '在庫数',
            'images.*.color_id' => '関連カラー',
            'images.*.image' => '画像',
            'images.*.image_category' => '画像種別',
            'images.*.file' => '画像ファイル', 
            'measurements.*.size_id' => 'サイズ',
            'measurements.*.width' => '身幅',
            'measurements.*.shoulder_width' => '肩幅',
            'measurements.*.raglan_sleeve_length' => '裄丈',
            'measurements.*.sleeve_length' => '袖丈',
            'measurements.*.length' => '着丈',
            'measurements.*.waist' => 'ウエスト',
            'measurements.*.hip' => 'ヒップ',
            'measurements.*.rise' => '股上',
            'measurements.*.inseam' => '股下',
            'measurements.*.thigh_width' => 'わたり',
            'measurements.*.outseam' => 'パンツ総丈',
            'measurements.*.sk_length' => 'スカート丈',
            'measurements.*.hem_width' => '裾幅',
            'measurements.*.weight' => '重量',
        ];
    }
}

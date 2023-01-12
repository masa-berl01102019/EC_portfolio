<?php

namespace App\Http\Requests\admin;

use Illuminate\Foundation\Http\FormRequest;

class ItemEditRequest extends FormRequest
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
            'price' => 'required|integer|min:0',
            'cost' => 'required|integer|min:0',
            'made_in' => 'required|string|max:80',
            'mixture_ratio' => 'required|string|max:255',
            'description' => 'required|string',
            'is_published' => 'required|integer|min:0|max:1',
            'brand_id' => 'required|integer',
            'gender_category' => 'required|integer',
            'main_category' => 'required|integer',
            'sub_category' => 'required|integer',
            'tags_id.*' => 'nullable|integer',
            'skus.*.id' => 'nullable|integer',
            'skus.*.item_id' => 'required|integer',
            'skus.*.size_id' => 'required|integer',
            'skus.*.color_id' => 'required|integer',
            'skus.*.quantity' => 'nullable|integer|min:0',
            'images.*.id' => 'nullable|integer',
            'images.*.item_id' => 'required|integer',
            'images.*.color_id' => 'required|integer',
            'images.*.image' => 'required|string|max:255',
            'images.*.image_category' => 'required|integer|min:0|max:1',
            'images.*.file' => 'nullable|file|image|mimes:png,jpeg,jpg,svg,svgz|max:1024',
            'measurements.*.id' => 'nullable|integer',
            'measurements.*.size_id' => 'required|integer',
            'measurements.*.width' => 'nullable|numeric|min:0',
            'measurements.*.shoulder_width' => 'nullable|numeric|min:0',
            'measurements.*.raglan_sleeve_length' => 'nullable|numeric|min:0',
            'measurements.*.sleeve_length' => 'nullable|numeric|min:0',
            'measurements.*.length' => 'nullable|numeric|min:0',
            'measurements.*.waist' => 'nullable|numeric|min:0',
            'measurements.*.hip' => 'nullable|numeric|min:0',
            'measurements.*.rise' => 'nullable|numeric|min:0',
            'measurements.*.inseam' => 'nullable|numeric|min:0',
            'measurements.*.thigh_width' => 'nullable|numeric|min:0',
            'measurements.*.outseam' => 'nullable|numeric|min:0',
            'measurements.*.sk_length' => 'nullable|numeric|min:0',
            'measurements.*.hem_width' => 'nullable|numeric|min:0',
            'measurements.*.weight' => 'nullable|numeric|min:0',
        ];
    }
}

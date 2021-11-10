<?php

namespace App\Http\Requests\admin;

use Illuminate\Foundation\Http\FormRequest;

class ItemMeasurementEditRequest extends FormRequest
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
            'measurements.*.size_id' => 'required|integer',
            'measurements.*.width' => 'nullable|integer',
            'measurements.*.shoulder_width' => 'nullable|integer',
            'measurements.*.raglan_sleeve_length' => 'nullable|integer',
            'measurements.*.sleeve_length' => 'nullable|integer',
            'measurements.*.length' => 'nullable|integer',
            'measurements.*.waist' => 'nullable|integer',
            'measurements.*.hip' => 'nullable|integer',
            'measurements.*.rise' => 'nullable|integer',
            'measurements.*.inseam' => 'nullable|integer',
            'measurements.*.thigh_width' => 'nullable|integer',
            'measurements.*.outseam' => 'nullable|integer',
            'measurements.*.sk_length' => 'nullable|integer',
            'measurements.*.hem_width' => 'nullable|integer',
            'measurements.*.weight' => 'nullable|integer',
        ];
    }

    public function attributes()
    {
        return [
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

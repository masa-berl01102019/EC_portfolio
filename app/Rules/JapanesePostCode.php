<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

/**
 * 国内の郵便番号チェック
 */
class JapanesePostCode implements Rule
{
    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Determine if the validation rule passes.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @return bool
     */
    public function passes($attribute, $value)
    {
        return preg_match("/^[0-9]{7}$/", $value);
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return trans('validation.japanese_post_code');
    }
}

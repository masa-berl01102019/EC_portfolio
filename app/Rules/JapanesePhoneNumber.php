<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

/**
 * 国内電話番号チェック（携帯電話含む）
 */
class JapanesePhoneNumber implements Rule
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
        return preg_match("/^(0{1}\d{1,4}-{0,1}\d{1,4}-{0,1}\d{4})$/", $value);
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return ':attributeは国内の電話番号のみ有効です';
    }
}
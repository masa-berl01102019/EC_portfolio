<?php

namespace App\Traits;

trait AccessorGenderCategoryTrait
{
    public function getGenderCategoryTextAttribute()
    {
        return isset($this->category_id) ? trans('api.const.category_id')[$this->category_id] : '';
    }
}

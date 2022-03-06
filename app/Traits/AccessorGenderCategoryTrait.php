<?php

namespace App\Traits;

trait AccessorGenderCategoryTrait
{
    public function getGenderCategoryTextAttribute() {
        return isset($this->category_id) ? config('define.category_id')[$this->category_id]: '';
    }
}

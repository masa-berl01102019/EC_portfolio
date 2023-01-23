<?php

namespace App\Traits;

trait AccessorNameTrait
{
    public function getFullNameAttribute() {
        return $this->last_name . ' ' . $this->first_name;
    }

    public function getFullNameKanaAttribute() {
        return $this->last_name_kana . ' ' . $this->first_name_kana;
    }
}

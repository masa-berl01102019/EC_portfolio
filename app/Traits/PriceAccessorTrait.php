<?php

namespace App\Traits;

trait PriceAccessorTrait
{
    public function getPriceTextAttribute() {
        return !empty($this->price)? number_format($this->price).'円' : '';
    }

    public function getCostTextAttribute() {
        return !empty($this->cost)? number_format($this->cost).'円' : '';
    }

}

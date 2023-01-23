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

    public function getTotalAmountTextAttribute() {
        return !empty($this->total_amount)? number_format($this->total_amount).'円' : '';
    }

    public function getSubTotalTextAttribute() {
        return !empty($this->sub_total)? number_format($this->sub_total).'円' : '';
    }

    public function getTaxAmountTextAttribute() {
        return !empty($this->tax_amount)? number_format($this->tax_amount).'円' : '';
    }

}

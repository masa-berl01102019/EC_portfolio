<?php

namespace App\Traits;

use App\Models\Tax;

trait AccessorPriceTrait
{
    public function getPriceTextAttribute() {
        return !empty($this->price)? '￥'.number_format($this->price) : '';
    }

    public function getCostTextAttribute() {
        return !empty($this->cost)? '￥'.number_format($this->cost) : '';
    }

    public function getTotalAmountTextAttribute() {
        return !empty($this->total_amount)? '￥'.number_format($this->total_amount) : '';
    }

    public function getSubTotalTextAttribute() {
        return !empty($this->sub_total)? '￥'.number_format($this->sub_total) : '';
    }

    public function getTaxAmountTextAttribute() {
        return !empty($this->tax_amount)? '￥'.number_format($this->tax_amount) : '';
    }

    public function getOrderPriceTextAttribute() {
        return !empty($this->order_price)? '￥'.number_format($this->order_price) : '';
    }

    public function getIncludedTaxPriceAttribute() {
        return $this->price + intval($this->price * Tax::getTaxRate());
    }

    public function getIncludedTaxPriceTextAttribute() {
        return !empty($this->price)? '￥'.number_format($this->price + intval($this->price * Tax::getTaxRate())) : '';
    }

}

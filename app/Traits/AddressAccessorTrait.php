<?php

namespace App\Traits;

trait AddressAccessorTrait
{
    public function getFullAddressAttribute() {
        return $this->prefecture . $this->municipality . $this->street_name . $this->street_number . $this->building;
    }

    public function getFullDeliveryAddressAttribute() {
        return $this->delivery_prefecture . $this->delivery_municipality . $this->delivery_street_name . $this->delivery_street_number . $this->delivery_building;
    }

    public function getPostCodeTextAttribute() {
        return !empty($this->post_code)? '〒'. substr_replace($this->post_code, "-", 3, 0): '';
    }

    public function getDeliveryPostCodeTextAttribute() {
        return !empty($this->delivery_post_code)? '〒'. substr_replace($this->delivery_post_code, "-", 3, 0): '';
    }
}

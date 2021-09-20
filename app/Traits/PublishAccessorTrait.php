<?php

namespace App\Traits;

trait PublishAccessorTrait
{
    public function getIsPublishedTextAttribute() {
        return isset($this->is_published) ? config('define.is_published')[$this->is_published]: '';
    }
}

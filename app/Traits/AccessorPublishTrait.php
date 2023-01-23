<?php

namespace App\Traits;

trait AccessorPublishTrait
{
    public function getIsPublishedTextAttribute()
    {
        return isset($this->is_published) ? trans('api.const.is_published')[$this->is_published] : '';
    }
}

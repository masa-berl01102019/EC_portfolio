<?php

namespace App\Traits;

trait CustomPaginateScopeTrait
{
    public function scopeCustomPaginate($query, $request)
    {

        // check if there is designate value of per_page
        if ($request->input('per_page')) {
            $per_page = $request->input('per_page');
            // Apply pagination * Need to convert strings into number
            return $query->paginate((int)$per_page);
        } else {
            // Default value is 12
            return $query->paginate(12);
        }
    }
}

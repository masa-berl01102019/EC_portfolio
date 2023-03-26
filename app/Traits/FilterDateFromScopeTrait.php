<?php

namespace App\Traits;

use Illuminate\Support\Carbon;

trait FilterDateFromScopeTrait
{
    public function scopeFilterDateFrom($query, $request, $prefix = null)
    {

        // Get the period of term
        $cloumn = $request->input('f_target_span');
        $from = $request->input('f_from');
        // Check if there is designated key
        $flag = !empty($cloumn) && !empty($from) ? true : false;

        $query->when($flag, function ($query) use ($cloumn, $from, $prefix) {
            // $prefix will be passed name of table
            $column_name = $prefix !== null ? $prefix . '.' . $cloumn : $cloumn;
            // Parse $from and create Carbon instances
            $begin = Carbon::parse($from);
            // Add start date to query
            return $query->where($column_name, '>=', $begin);
        });
    }
}

<?php

namespace App\Traits;

use Illuminate\Support\Carbon;

trait FilterDateRangeScopeTrait
{
    public function scopeFilterDateRange($query, $request, $prefix = null)
    {

        // Get the period of term
        $cloumn = $request->input('f_target_span');
        $from = $request->input('f_from');
        $to = $request->input('f_to');
        // Check if there is designated key
        $flag = !empty($cloumn) && (!empty($from) || !empty($to)) ? true : false;

        $query->when($flag, function ($query) use ($cloumn, $from, $to, $prefix) {
            // $prefix will be passed name of table
            $column_name = $prefix !== null ? $prefix . '.' . $cloumn : $cloumn;
            // Parse $from and $to and create Carbon instances
            $begin = Carbon::parse($from);
            $end = Carbon::parse($to);
            // Add start date and end date to query
            return $query->whereBetween($column_name, [$begin, $end]);
        });
    }
}

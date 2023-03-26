<?php

namespace App\Traits;

use Illuminate\Support\Carbon;

trait FilterDateToScopeTrait
{
    public function scopeFilterDateTo($query, $request, $prefix = null)
    {

        // Get the period of term
        $cloumn = $request->input('f_target_span');
        $to = $request->input('f_to');
        // Check if there is designated key
        $flag = !empty($cloumn) && !empty($to) ? true : false;

        $query->when($flag, function ($query) use ($cloumn, $to, $prefix) {
            // $prefix will be passed name of table
            $column_name = $prefix !== null ? $prefix . '.' . $cloumn : $cloumn;
            // Parse $to and create Carbon instances
            $end = Carbon::parse($to)->addDay();
            // Add end date to query
            return $query->where($column_name, '<', $end);
        });
    }
}

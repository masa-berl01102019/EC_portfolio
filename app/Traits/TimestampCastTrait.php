<?php

namespace App\Traits;

use DateTimeInterface;
use Illuminate\Support\Carbon;

trait TimestampCastTrait
{
    // The timestamp type depends on the locale of config.php.
    // ・Check the time zone of the set locale, and convert it to UTC and insert it into the DB when date is saved in the DB.
    // ・Check the time zone and display it in the set time zone when data is selected from the DB.
    //  When data is serialized to JSON format, the time is off because it is serialized in UTC time without considering the time zone.
    // Therefore, it's necessary to override serializeDate() and set the time zone at the time of serialization to convert it to a date string.
    protected function serializeDate(DateTimeInterface $date)
    {
        return Carbon::instance($date)->tz('Asia/Tokyo')->format('Y/m/d H:i');
    }
}

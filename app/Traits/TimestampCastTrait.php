<?php

namespace App\Traits;

use DateTimeInterface;
use Illuminate\Support\Carbon;

trait TimestampCastTrait
{
    // timestamp型はconfig.phpのlocaleに依存しているので
    // DB保存時はセットされてるlocaleのタイムゾーンを確認してUTCに変換してDBにinsertするがselect時にはタイムゾーンを確認してセットされたタイムゾーンで表示される
    // JSON形式にシリアライズする際はタイムゾーンを考慮しないでUTCの時間でシリアライズされるので時間がずれてしまう
    // その為、serializeDate()をオーバーライドしてシリアライズ時にタイムゾーンをセットして日付文字列に変換する必要がある
    protected function serializeDate(DateTimeInterface $date)
    {
       return Carbon::instance($date)->tz('Asia/Tokyo')->format('Y/m/d H:i');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PasswordReset extends Model
{
    // updated_at不要なのでnullをセット
    const UPDATED_AT = null;

    /** シリアライズ */

    // 編集不可カラム
    protected $guarded = [
        'id'
    ];
}

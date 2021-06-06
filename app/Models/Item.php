<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    // timestamp無効にしないとデータ挿入時にエラーになる
    public $timestamps = false;
}

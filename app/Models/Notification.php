<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Notification extends Model
{
    use SoftDeletes; //　論理削除

    // timestamp無効にしないとデータ挿入時にエラーになる
    public $timestamps = false;

    /** シリアライズ */

    // 編集不可カラム
    protected $guarded = [
        'id'
    ];

    // モデルからシリアライズ時の日付形式の設定
    protected $casts = [
        'posted_at' => 'date:Y-m-d',
        'modified_at' => 'date:Y-m-d',
        'expired_at' => 'date:Y-m-d',
    ];

    /** リレーション */

    public function admin() {
        return $this->belongsTo('App\Models\Admin');
    }

}

<?php

namespace App\Models;

use App\Traits\AccessorNameTrait;
use App\Traits\AccessorPublishTrait;
use App\Traits\OrderByNameScopeTrait;
use App\Traits\GetPublishedScopeTrait;
use App\Traits\FilterKeywordScopeTrait;
use Illuminate\Database\Eloquent\Model;
use App\Traits\CustomPaginateScopeTrait;
use App\Traits\FilterDateRangeScopeTrait;
use App\Traits\OrderByPostedAtScopeTrait;
use App\Traits\FilterIsPublishedScopeTrait;
use App\Traits\OrderByModifiedAtScopeTrait;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Notification extends Model
{
    use HasFactory; // laravel8 factory関数使用する為
    use SoftDeletes; // 論理削除
    use AccessorPublishTrait;
    use AccessorNameTrait;
    use OrderByNameScopeTrait;
    use OrderByPostedAtScopeTrait;
    use OrderByModifiedAtScopeTrait;
    use FilterKeywordScopeTrait;
    use FilterDateRangeScopeTrait;
    use FilterIsPublishedScopeTrait;
    use GetPublishedScopeTrait;
    use CustomPaginateScopeTrait;

    // timestamp無効にしないとデータ挿入時にエラーになる
    public $timestamps = false;

    /** シリアライズ */

    // 編集不可カラム
    protected $guarded = [
        'id'
    ];

    // モデルからシリアライズ時の日付形式の設定
    protected $casts = [
        'posted_at' => 'date:Y/m/d H:i',
        'modified_at' => 'date:Y/m/d H:i',
        'expired_at' => 'date:Y/m/d H:i',
    ];

    /** アクセサ */

    // 配列内に含めたい独自の属性(カラム名)を定義
    protected $appends = ['is_published_text', 'full_name', 'full_name_kana'];

    /** スコープ */

    public function scopeOrderByExpiredAt($query, $request) {
        $sort = $request->input('expired_at');
        $query->when($sort, function($query, $sort) {
            return $query->orderBy('expired_at', $sort);
        });
    }

    /** リレーション */

    public function admin() {
        return $this->belongsTo('App\Models\Admin');
    }

}

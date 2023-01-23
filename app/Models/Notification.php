<?php

namespace App\Models;

use App\Traits\FilterDateRangeScopeTrait;
use App\Traits\FilterIsPublishedScopeTrait;
use App\Traits\FilterKeywordScopeTrait;
use App\Traits\NameAccessorTrait;
use App\Traits\OrderByExpiredAtScopeTrait;
use App\Traits\OrderByModifiedAtScopeTrait;
use App\Traits\OrderByNameScopeTrait;
use App\Traits\OrderByPostedAtScopeTrait;
use App\Traits\PublishAccessorTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Notification extends Model
{
    use SoftDeletes; //　論理削除
    use PublishAccessorTrait;
    use NameAccessorTrait;
    use OrderByNameScopeTrait;
    use OrderByExpiredAtScopeTrait;
    use OrderByPostedAtScopeTrait;
    use OrderByModifiedAtScopeTrait;
    use FilterKeywordScopeTrait;
    use FilterDateRangeScopeTrait;
    use FilterIsPublishedScopeTrait;

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

    /** アクセサ */

    // 配列内に含めたい独自の属性(カラム名)を定義
    protected $appends = ['is_published_text', 'full_name', 'full_name_kana'];

    /** リレーション */

    public function admin() {
        return $this->belongsTo('App\Models\Admin');
    }

}

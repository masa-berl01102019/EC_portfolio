<?php

namespace App\Models;

use App\Traits\AccessorNameTrait;
use App\Traits\TimestampCastTrait;
use App\Traits\OrderByNameScopeTrait;
use App\Traits\FilterKeywordScopeTrait;
use Illuminate\Database\Eloquent\Model;
use App\Traits\CustomPaginateScopeTrait;
use App\Traits\FilterDateRangeScopeTrait;
use App\Traits\OrderByCreatedAtScopeTrait;
use App\Traits\OrderByUpdatedAtScopeTrait;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Contact extends Model
{
    use HasFactory; // laravel8 factory関数使用する為
    use SoftDeletes; // 論理削除
    use AccessorNameTrait;
    use OrderByNameScopeTrait;
    use OrderByCreatedAtScopeTrait;
    use OrderByUpdatedAtScopeTrait;
    use FilterKeywordScopeTrait;
    use FilterDateRangeScopeTrait;
    use TimestampCastTrait;
    use CustomPaginateScopeTrait;

    // updated_atのみ自動更新を無効に設定
    const UPDATED_AT = NULL;

    /** シリアライズ */

    // 編集不可カラム
    protected $guarded = [
        'id'
    ];

    // モデルからシリアライズ時の日付形式の設定 Datetime型用
    protected $casts = [
        'updated_at' => 'date:Y/m/d H:i'
    ];

    /** アクセサ */

    // 配列内に含めたい独自の属性(カラム名)を定義
    protected $appends = ['response_status_text', 'full_name', 'full_name_kana' ];

    // 関数の返却値を独自の属性(カラム名)として設定
    public function getResponseStatusTextAttribute() {
        return isset($this->response_status) ? config('define.response_status')[$this->response_status]: '';
    }

    /** スコープ */

    public function scopeFilterResponseStatus($query, $request) {
        $filter = $request->input('f_response_status');
        $flag = $filter !== null ? true : false;
        $query->when($flag, function($query) use($filter) {
            // カンマ区切りで配列に変換
            $status_arr = explode(',',$filter);
            // 配列内に該当する項目を絞り込み検索
            return $query->whereIn('response_status', $status_arr);
        });
    }

    /** リレーション */

    public function user() {
        return $this->belongsTo('App\Models\User');
    }

    public function admin() {
        return $this->belongsTo('App\Models\Admin');
    }

}

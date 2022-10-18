<?php

namespace App\Http\Controllers\Admin;

use Throwable;
use Carbon\Carbon;
use App\Models\Admin;
use Illuminate\Support\Str;
use App\Models\PasswordReset;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Mail\Admin\AdminResetPasswordMail;
use App\Mail\Admin\AdminChangePasswordMail;
use App\Http\Requests\admin\ResetPasswordRequest;
use App\Http\Requests\admin\ChangePasswordRequest;

class ResetPasswordController extends Controller
{
    // 該当のカラム以外を扱わないようにホワイトリスト作成
    private $form_items = ['email', 'password', 'uuid'];

    public function send(ResetPasswordRequest $request)
    {
        // ホワイトリストを適用
        $data = $request->only($this->form_items);

        DB::beginTransaction();
        try {
            // ユーザーがログインしてるかチェック
            if (Auth::guard('admin')->check()) {
                // ユーザーのログアウト
                Auth::guard('admin')->logout();
                // セッションIDの再発行
                $request->session()->regenerate();
            }
            // 渡ってきたemailのユーザーを取得
            $admin = Admin::where('email', $data['email'])->first();
            // 該当のユーザーがいるかチェック
            if (!$admin) {
                return response()->json(['success' => false, 'message' => '該当のユーザーが存在しません。'], 404);
            }
            // DBに登録
            $password_reset = PasswordReset::create([
                'admin_id' => $admin->id,
                'uuid' => Str::uuid(),
                'email' => $data['email'],
                'expired_at' => Carbon::now()->addHours(1), // 1時間を有効とする
            ]);
            // メール配信
            Mail::to($admin->email)->send(new AdminResetPasswordMail($password_reset, $admin->full_name));

            DB::commit();
            return response()->json(['success' => true, 'message' => 'パスワード再設定メールを送信しました'], 200);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            DB::rollBack();
            return response()->json(['success' => false, 'message' => 'パスワード再設定メールを送信に失敗しました'], 500);
        }
    }

    public function change(ChangePasswordRequest $request)
    {
        // ホワイトリストを適用
        $data = $request->only($this->form_items);

        DB::beginTransaction();
        try {
            // 渡ってきたuuidのレコードを取得
            $password_reset = PasswordReset::where('uuid', $data['uuid'])->first();
            // 該当のレコードの有無を確認
            if (!$password_reset) {
                return response()->json(['success' => false, 'message' => '該当のレコードが存在しません。'], 404);
            }
            // 現在時刻を取得
            $now = Carbon::now();
            // 有効期限を取得
            $expired_at = Carbon::parse($password_reset->expired_at);
            // 有効期限を確認
            if ($now->gt($expired_at)) {
                return response()->json(['success' => false, 'message' => '有効期限が切れております'], 404);
            }
            // 該当のユーザーを取得
            $admin = Admin::find($password_reset->admin_id);
            // 該当のユーザーの有無を確認
            if (!$admin) {
                return response()->json(['success' => false, 'message' => '該当のユーザーが存在しません。'], 404);
            }
            // DBに登録
            $admin->fill([
                'password' => Hash::make($data['password'])
            ])->save();
            // メール配信
            Mail::to($admin->email)->send(new AdminChangePasswordMail($admin->full_name));

            DB::commit();
            return response()->json(['success' => true, 'message' => 'パスワード変更を完了しました'], 200);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            DB::rollBack();
            return response()->json(['success' => false, 'message' => 'パスワード変更に失敗しました'], 500);
        }
    }
}

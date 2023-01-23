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
    private $form_items = ['email', 'password', 'uuid'];

    public function send(ResetPasswordRequest $request)
    {
        DB::beginTransaction();
        try {
            $data = $request->only($this->form_items);
            // log out if admin has been logged in
            if (Auth::guard('admin')->check()) {
                Auth::guard('admin')->logout();
                $request->session()->regenerate();
            }
            $admin = Admin::where('email', $data['email'])->first();
            // checking user existence
            if (!$admin) {
                return response()->json(['status' => 9, 'message' => trans('api.admin.reset_passwords.send_err')], 400);
            }
            $password_reset = PasswordReset::create([
                'admin_id' => $admin->id,
                'uuid' => Str::uuid(),
                'email' => $data['email'],
                'expired_at' => Carbon::now()->addHours(1)
            ]);
            Mail::to($admin->email)->send(new AdminResetPasswordMail($password_reset, $admin->full_name));
            DB::commit();
            return response()->json(['status' => 1, 'message' => trans('api.admin.reset_passwords.send_msg')], 200);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            DB::rollBack();
            return response()->json(['status' => 9, 'message' => trans('api.admin.reset_passwords.send_err2')], 500);
        }
    }

    public function change(ChangePasswordRequest $request)
    {
        DB::beginTransaction();
        try {
            $data = $request->only($this->form_items);
            $password_reset = PasswordReset::where('uuid', $data['uuid'])->first();
            // checking record existence
            if (!$password_reset) {
                return response()->json(['status' => 9, 'message' => trans('api.admin.reset_passwords.change_err')], 400);
            }
            $now = Carbon::now();
            $expired_at = Carbon::parse($password_reset->expired_at);
            // checking expired_at
            if ($now->gt($expired_at)) {
                return response()->json(['status' => 9, 'message' => trans('api.admin.reset_passwords.change_err2')], 400);
            }
            $admin = Admin::find($password_reset->admin_id);
            // checking admin existence
            if (!$admin) {
                return response()->json(['status' => 9, 'message' => trans('api.admin.reset_passwords.change_err3')], 400);
            }
            $admin->fill([
                'password' => Hash::make($data['password'])
            ])->save();
            Mail::to($admin->email)->send(new AdminChangePasswordMail($admin->full_name));
            DB::commit();
            return response()->json(['status' => 1, 'message' => trans('api.admin.reset_passwords.change_msg')], 200);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            DB::rollBack();
            return response()->json(['status' => 9, 'message' => trans('api.admin.reset_passwords.change_err4')], 500);
        }
    }
}

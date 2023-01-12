<?php

namespace App\Http\Controllers\User;

use Throwable;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Http\Requests\user\UserEditRequest;
use App\Http\Requests\user\UserRegisterRequest;

class UserController extends Controller
{
    private $form_items = [
        'last_name', 'last_name', 'first_name', 'last_name_kana', 'first_name_kana', 'gender', 'birthday', 'post_code', 'prefecture', 'municipality', 'street_name', 'street_number', 'building',
        'delivery_post_code', 'delivery_prefecture', 'delivery_municipality', 'delivery_street_name', 'delivery_street_number', 'delivery_building', 'tel', 'email', 'password', 'is_received'
    ];

    public function __construct()
    {
        // $this->middleware('auth:user');
    }

    public function store(UserRegisterRequest $request)
    {
        DB::beginTransaction();
        try {
            $data = $request->only($this->form_items);
            User::create([
                'last_name' => $data['last_name'],
                'first_name' => $data['first_name'],
                'last_name_kana' => $data['last_name_kana'],
                'first_name_kana' => $data['first_name_kana'],
                'gender' => $data['gender'],
                'birthday' => $data['birthday'],
                'post_code' => $data['post_code'],
                'prefecture' => $data['prefecture'],
                'municipality' => $data['municipality'],
                'street_name' => $data['street_name'],
                'street_number' => $data['street_number'],
                'building' => $data['building'],
                'delivery_post_code' => $data['delivery_post_code'],
                'delivery_prefecture' => $data['delivery_prefecture'],
                'delivery_municipality' => $data['delivery_municipality'],
                'delivery_street_name' => $data['delivery_street_name'],
                'delivery_street_number' => $data['delivery_street_number'],
                'delivery_building' => $data['delivery_building'],
                'tel' => $data['tel'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
                'is_received' => $data['is_received'],
            ]);
            DB::commit();
            return response()->json(['status' => 1, 'message' => trans('api.user.users.create_msg')], 200);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            DB::rollBack();
            return response()->json(['status' => 9, 'message' => trans('api.user.users.create_err')], 500);
        }
    }

    public function edit()
    {
        try {
            return new UserResource(Auth::guard('user')->user());
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            return response()->json(['status' => 9, 'message' => trans('api.user.users.get_err')], 500);
        }
    }

    public function update(UserEditRequest $request, User $user)
    {
        DB::beginTransaction();
        try {
            $data = $request->only($this->form_items);
            $user->fill($data)->save();
            DB::commit();
            return response()->json(['status' => 1, 'message' => trans('api.user.users.update_msg')], 200);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            DB::rollBack();
            return response()->json(['status' => 9, 'message' => trans('api.user.users.update_err')], 500);
        }
    }

    public function destroy(Request $request, User $user)
    {
        DB::beginTransaction();
        try {
            $user->delete();
            DB::commit();
            return response()->json(['status' => 1, 'message' => trans('api.user.users.delete_msg')], 200);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            DB::rollBack();
            return response()->json(['status' => 9, 'message' => trans('api.user.users.delete_err')], 500);
        }
    }
}

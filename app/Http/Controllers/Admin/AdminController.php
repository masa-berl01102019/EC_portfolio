<?php

namespace App\Http\Controllers\Admin;

use Throwable;
use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use App\Http\Resources\AdminResource;
use App\Http\Requests\admin\AdminEditRequest;
use App\Http\Requests\admin\AdminRegisterRequest;

class AdminController extends Controller
{
    private $form_items = ['last_name', 'first_name', 'last_name_kana', 'first_name_kana', 'tel', 'email', 'password'];

    public function __construct()
    {
        $this->middleware('auth:admin');
    }

    public function index(Request $request)
    {
        try {
            $search_admin = Admin::query();
            $search_admin->filterKeyword($request, ['last_name', 'first_name', 'last_name_kana', 'first_name_kana']);
            $search_admin->filterDateFrom($request);
            $search_admin->filterDateTo($request);
            // last_name > created_at > updated_at
            $search_admin->orderByName($request);
            $search_admin->orderByCreatedAt($request);
            $search_admin->orderByUpdatedAt($request);
            $admins = $search_admin->customPaginate($request);
            return AdminResource::collection($admins);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            return response()->json(['status' => config('define.api_status.error'), 'message' => trans('api.admin.admins.get_err')], 500);
        }
    }

    public function store(AdminRegisterRequest $request)
    {
        DB::beginTransaction();
        try {
            $data = $request->only($this->form_items);
            Admin::create([
                'last_name' => $data['last_name'],
                'first_name' => $data['first_name'],
                'last_name_kana' => $data['last_name_kana'],
                'first_name_kana' => $data['first_name_kana'],
                'tel' => $data['tel'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
            ]);
            DB::commit();
            return response()->json(['status' => config('define.api_status.success'), 'message' => trans('api.admin.admins.create_msg')], 200);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            DB::rollBack();
            return response()->json(['status' => config('define.api_status.error'), 'message' => trans('api.admin.admins.create_err')], 500);
        }
    }

    public function edit(Admin $admin)
    {
        try {
            return new AdminResource($admin);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            return response()->json(['status' => config('define.api_status.error'), 'message' => trans('api.admin.admins.get_err')], 500);
        }
    }

    public function update(AdminEditRequest $request, Admin $admin)
    {
        DB::beginTransaction();
        try {
            $data = $request->only($this->form_items);
            $admin->fill($data)->save();
            DB::commit();
            return response()->json(['status' => config('define.api_status.success'), 'message' => trans('api.admin.admins.update_msg')], 200);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            DB::rollBack();
            return response()->json(['status' => config('define.api_status.error'), 'message' => trans('api.admin.admins.update_err')], 500);
        }
    }

    public function destroy(Request $request)
    {
        DB::beginTransaction();
        try {
            $admins = $request->all();
            // Added the following condition so that visitors don't delete published test account accidentary.
            if (in_array(1, $admins)) {
                return response()->json(['status' => config('define.api_status.error'), 'message' => "403 Published TEST account for visitors is included."], 403);
            }
            foreach ($admins as $admin) {
                $admin = Admin::find($admin);
                $admin->delete();
            }
            DB::commit();
            return response()->json(['status' => config('define.api_status.success'), 'message' => trans('api.admin.admins.delete_msg')], 200);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            DB::rollBack();
            return response()->json(['status' => config('define.api_status.error'), 'message' => trans('api.admin.admins.delete_err')], 500);
        }
    }

    public function csvExport(Request $request)
    {
        try {
            $id = $request->all();
            $admins = Admin::whereIn('id', $id)->cursor();
            $csv_body = [];
            $num = 1;
            foreach ($admins as $admin) {
                $csv_body[] = [
                    $num,
                    $admin->id,
                    $admin->full_name . '(' . $admin->full_name_kana . ')',
                    $admin->tel,
                    $admin->email,
                    $admin->created_at,
                    $admin->updated_at,
                ];
                $num++;
            }
            $csv_header = trans('api.admin.admins.csv_header');
            return csvExport($csv_body, $csv_header, trans('api.admin.admins.csv_file_name'));
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            return response()->json(['status' => config('define.api_status.error'), 'message' => trans('api.admin.admins.csv_err')], 500);
        }
    }
}

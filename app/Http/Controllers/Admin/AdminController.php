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
            $search_admin->filterDateRange($request);
            // last_name > created_at > updated_at
            $search_admin->orderByName($request);
            $search_admin->orderByCreatedAt($request);
            $search_admin->orderByUpdatedAt($request);
            $admins = $search_admin->customPaginate($request);
            return AdminResource::collection($admins);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            return response()->json(['status' => 9, 'message' => '管理者の取得に失敗しました'], 500);
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
            return response()->json(['status' => 1, 'message' => '管理者の登録を完了しました'], 200);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            DB::rollBack();
            return response()->json(['status' => 9, 'message' => '管理者の登録に失敗しました'], 500);
        }
    }

    public function edit(Admin $admin)
    {
        try {
            return new AdminResource($admin);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            return response()->json(['status' => 9, 'message' => '管理者の取得に失敗しました'], 500);
        }
    }

    public function update(AdminEditRequest $request, Admin $admin)
    {
        DB::beginTransaction();
        try {
            $data = $request->only($this->form_items);
            $admin->fill($data)->save();
            DB::commit();
            return response()->json(['status' => 1, 'message' => '管理者の編集を完了しました'], 200);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            DB::rollBack();
            return response()->json(['status' => 9, 'message' => '管理者の編集に失敗しました'], 500);
        }
    }

    public function destroy(Request $request)
    {
        DB::beginTransaction();
        try {
            $admins = $request->all();
            foreach ($admins as $admin) {
                $admin = Admin::find($admin);
                $admin->delete();
            }
            DB::commit();
            return response()->json(['status' => 1, 'message' => '管理者の削除を完了しました'], 200);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            DB::rollBack();
            return response()->json(['status' => 9, 'message' => '管理者の削除に失敗しました'], 500);
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
            $csv_header = ['No', 'ID', '氏名', '電話番号', 'メールアドレス', '作成日時', '更新日時'];
            return csvExport($csv_body, $csv_header, '管理者情報.csv');
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            return response()->json(['status' => 9, 'message' => '管理者情報CSVの出力に失敗しました'], 500);
        }
    }
}

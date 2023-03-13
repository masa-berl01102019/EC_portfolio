<?php

namespace App\Http\Controllers\Admin;

use Throwable;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\NotificationResource;
use App\Http\Requests\admin\NotificationRequest;

class NotificationController extends Controller
{
    private $form_items = ['admin_id', 'title', 'body', 'is_published', 'expired_at', 'posted_at', 'modified_at'];

    public function __construct()
    {
        $this->middleware('auth:admin');
    }

    public function index(Request $request)
    {
        try {
            $search_notification = Notification::with('admin');
            $search_notification->filterKeyword($request, ['title']);
            $search_notification->filterDateRange($request);
            $search_notification->filterIsPublished($request);
            // expired_at > posted_at > updated_at
            $search_notification->orderByExpiredAt($request);
            $search_notification->orderByPostedAt($request);
            $search_notification->orderByModifiedAt($request);
            $notifications = $search_notification->customPaginate($request);
            return NotificationResource::collection($notifications);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            return response()->json(['status' => config('define.api_status.error'), 'message' => trans('api.admin.notifications.get_err')], 500);
        }
    }

    public function store(NotificationRequest $request)
    {
        DB::beginTransaction();
        try {
            $data = $request->only($this->form_items);
            Notification::create([
                'admin_id' => Auth::guard('admin')->id(),
                'title' => $data['title'],
                'body' => $data['body'],
                'is_published' => $data['is_published'],
                'expired_at' => $data['expired_at'],
                'posted_at' => $data['is_published'] == config('define.is_published.open') ? Carbon::now() : null
            ]);
            DB::commit();
            return response()->json(['status' => config('define.api_status.success'), 'message' => trans('api.admin.notifications.create_msg')], 200);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            DB::rollBack();
            return response()->json(['status' => config('define.api_status.error'), 'message' => trans('api.admin.notifications.create_err')], 500);
        }
    }

    public function edit(Notification $notification)
    {
        try {
            return new NotificationResource($notification);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            return response()->json(['status' => config('define.api_status.error'), 'message' => trans('api.admin.notifications.get_err')], 500);
        }
    }

    public function update(NotificationRequest $request, Notification $notification)
    {
        DB::beginTransaction();
        try {
            $data = $request->only($this->form_items);
            // which column should be register depends on whether the record wasn't published once yet
            $registered_date = $notification->posted_at !== null ? 'modified_at' : 'posted_at';
            $date = $registered_date === 'modified_at' ? $notification->modified_at : $notification->posted_at;
            $notification->fill([
                'admin_id' => Auth::guard('admin')->id(),
                'title' => $data['title'],
                'body' => $data['body'],
                'is_published' => $data['is_published'],
                'expired_at' => $data['expired_at'],
                $registered_date => $data['is_published'] == config('define.is_published.open') ? Carbon::now() : $date, // don't update published date if is_published status close
            ])->save();
            DB::commit();
            return response()->json(['status' => config('define.api_status.success'), 'message' => trans('api.admin.notifications.update_msg')], 200);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            DB::rollBack();
            return response()->json(['status' => config('define.api_status.error'), 'message' => trans('api.admin.notifications.update_err')], 500);
        }
    }

    public function destroy(Request $request)
    {
        DB::beginTransaction();
        try {
            $notifications = $request->all();
            foreach ($notifications as $notification) {
                $notification = Notification::find($notification);
                $notification->delete();
            }
            DB::commit();
            return response()->json(['status' => config('define.api_status.success'), 'message' => trans('api.admin.notifications.delete_msg')], 200);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            DB::rollBack();
            return response()->json(['status' => config('define.api_status.error'), 'message' => trans('api.admin.notifications.delete_err')], 500);
        }
    }

    public function csvExport(Request $request)
    {
        try {
            $id = $request->all();
            $notifications = Notification::whereIn('id', $id)->with('admin')->cursor();
            $csv_body = [];
            $num = 1;
            foreach ($notifications as $notification) {
                $csv_body[] = [
                    $num,
                    $notification->id,
                    $notification->is_published_text,
                    $notification->title,
                    $notification->body,
                    optional($notification->admin)->full_name . '(' . optional($notification->admin)->full_name_kana . ')',
                    $notification->expired_at !== null ? $notification->expired_at->format('Y/m/d H:i') : '　　',
                    $notification->posted_at !== null ? $notification->posted_at->format('Y/m/d H:i') : '　　',
                    $notification->modified_at !== null ? $notification->modified_at->format('Y/m/d H:i') : '　　',
                ];
                $num++;
            }
            $csv_header = trans('api.admin.notifications.csv_header');
            return csvExport($csv_body, $csv_header, trans('api.admin.notifications.csv_file_name'));
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            return response()->json(['status' => config('define.api_status.error'), 'message' => trans('api.admin.notifications.csv_err')], 500);
        }
    }
}

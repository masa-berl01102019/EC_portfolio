<?php

namespace App\Http\Controllers\User;

use Throwable;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Http\Resources\NotificationResource;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        try {
            $search_notification = Notification::getPublished()->with('admin')->where('expired_at', '>=', Carbon::now());
            $notifications = $search_notification->customPaginate($request);
            return NotificationResource::collection($notifications);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            return response()->json(['status' => config('define.api_status.error'), 'message' => trans('api.user.notifications.get_err')], 500);
        }
    }
}

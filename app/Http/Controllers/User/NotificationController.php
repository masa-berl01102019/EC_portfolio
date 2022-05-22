<?php

namespace App\Http\Controllers\User;

use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use App\Http\Controllers\Controller;
use App\Http\Resources\NotificationResource;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $search_notification = Notification::getPublished()->with('admin')->where('expired_at', '>=', Carbon::now());
        // ページネーション
        $notifications = $search_notification->customPaginate($request);
        // レスポンスを返却
        return NotificationResource::collection($notifications);
    }
}

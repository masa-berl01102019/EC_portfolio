<?php

namespace App\Http\Controllers\Admin;

use Throwable;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Http\Requests\admin\OrderEditRequest;

class OrderController extends Controller
{
    private $form_items = ['is_paid', 'is_shipped', 'delivery_date', 'delivery_time'];

    public function __construct()
    {
        $this->middleware('auth:admin');
    }

    public function index(Request $request)
    {
        try {
            $search_order = Order::where('payment_status', config('define.payment_status_r.success'))->with('user');
            $search_order->filterDateRange($request);
            $search_order->filterPaymentMethod($request);
            $search_order->filterIsPaid($request);
            $search_order->filterIsShipped($request);
            // total > delivery_date > created_at > updated_at 
            $search_order->orderByTotalAmount($request);
            $search_order->orderByDeliveryDate($request);
            $search_order->orderByCreatedAt($request);
            $search_order->orderByUpdatedAt($request);
            $orders = $search_order->customPaginate($request);
            return OrderResource::collection($orders);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            return response()->json(['status' => 9, 'message' => '受注の取得に失敗しました'], 500);
        }
    }

    public function edit($order)
    {
        try {
            $order = Order::where('id', $order)->where('payment_status', config('define.payment_status_r.success'))->with('orderDetails')->first();
            return new OrderResource($order);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            return response()->json(['status' => 9, 'message' => '受注の取得に失敗しました'], 500);
        }
    }

    public function update(OrderEditRequest $request, Order $order)
    {
        DB::beginTransaction();
        try {
            $data = $request->only($this->form_items);
            $order->fill([
                'is_paid' => $data['is_paid'],
                'is_shipped' => $data['is_shipped'],
                'delivery_date' => $data['delivery_date'],
                'delivery_time' => $data['delivery_time']
            ])->save();
            DB::commit();
            return response()->json(['status' => 1, 'message' => '受注の編集を完了しました'], 200);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            DB::rollBack();
            return response()->json(['status' => 9, 'message' => '受注の編集に失敗しました'], 500);
        }
    }

    public function destroy(Request $request)
    {
        DB::beginTransaction();
        try {
            $items = $request->all();
            foreach ($items as $item) {
                $item = Order::find($item);
                $item->delete();
            }
            DB::commit();
            return response()->json(['status' => 1, 'message' => '受注の削除を完了しました'], 200);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            DB::rollBack();
            return response()->json(['status' => 9, 'message' => '受注の削除に失敗しました'], 500);
        }
    }

    public function csvExport(Request $request)
    {
        try {
            $id = $request->all();
            $items = Order::where('payment_status', config('define.payment_status_r.success'))->whereIn('id', $id)->with('user')->cursor();
            $csv_body = [];
            $num = 1;
            foreach ($items as $item) {
                $csv_body[] = [
                    $num,
                    $item->id,
                    $item->created_at,
                    $item->total_amount_text,
                    $item->payment_method_text,
                    $item->delivery_date,
                    $item->delivery_time,
                    $item->is_paid_text,
                    $item->is_shipped_text,
                    $item->user->full_name . '(' . $item->user->full_name_kana . ')',
                    $item->user->tel,
                    $item->user->email,
                    $item->user->delivery_post_code_text ? $item->user->delivery_post_code_text : $item->user->post_code_text,
                    $item->user->full_delivery_address ? $item->user->full_delivery_address : $item->user->full_address,
                    $item->updated_at,
                ];
                $num++;
            }
            $csv_header = ['No', 'ID', '購入日', '購入金額', '支払方法', '希望配達日', '希望配達時間帯', '入金状況', '出荷状況', '購入者(カナ)', '連絡先', 'メールアドレス', '配送先 郵便番号', '配送先 住所', 'ステータス更新日'];
            return csvExport($csv_body, $csv_header, '受注情報.csv');
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            return response()->json(['status' => 9, 'message' => '受注情報CSVの出力に失敗しました'], 500);
        }
    }
}

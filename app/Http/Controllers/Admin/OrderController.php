<?php

namespace App\Http\Controllers\Admin;

use App\Models\Order;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Http\Requests\admin\OrderEditRequest;

class OrderController extends Controller
{
    // 該当のカラム以外を扱わないようにホワイトリスト作成
    private $form_items = [ 'is_paid', 'is_shipped', 'delivery_date', 'delivery_time' ];

    public function __construct()
    {
        // Auth認証
        $this->middleware('auth:admin');
    }

    public function index(Request $request)
    {
        $search_order = Order::where('payment_status', config('define.payment_status_r.success'))->with('user');

        // 検索期間の指定フィルター
        $search_order->filterDateRange($request);
        // 支払い方法の指定フィルター
        $search_order->filterPaymentMethod($request);
        // 入金ステータスの指定フィルター
        $search_order->filterIsPaid($request);
        // 配送ステータスの指定フィルター
        $search_order->filterIsShipped($request);

        // 合計金額->配達希望日->作成日順->更新日順の優先順位でソートされる仕組み

        // 合計金額でソート
        $search_order->orderByTotalAmount($request);
        // 配達希望日でソート
        $search_order->orderByDeliveryDate($request);
        // 作成日でソート
        $search_order->orderByCreatedAt($request);
        // 更新日でソート
        $search_order->orderByUpdatedAt($request);

        // ページネーション
        $orders = $search_order->customPaginate($request);

        // レスポンスを返却
        return OrderResource::collection($orders);
    }

    public function edit($order)
    {
        $order = Order::where('id', $order)->where('payment_status', config('define.payment_status_r.success'))->with('orderDetails')->first();

        // レスポンスを返却
        return new OrderResource($order);
    }

    public function update(OrderEditRequest $request, Order $order)
    {
        // 項目制限
        $data = $request->only($this->form_items);
        // 基本情報をDBに保存
        $order->fill([
            'is_paid' => $data['is_paid'],
            'is_shipped' => $data['is_shipped'],
            'delivery_date' => $data['delivery_date'],
            'delivery_time' => $data['delivery_time']
        ])->save();

        return response()->json(['update' => true, 'message' => '注文の編集を完了しました'], 200);
    }

    public function destroy(Request $request)
    {
        // 複数のIDが渡ってくるので全て取得する
        $items = $request->all();
        foreach($items as $item) {
            // インスタンスを生成して削除
            $item = Order::find($item);
            $item->delete();
        }
        // レスポンスを返却
        return response()->json(['delete' => true, 'message' => '注文の削除を完了しました'], 200);
    }

   public function csvExport(Request $request)
   {
        // 複数のIDが渡ってくるので全て取得する
        $id = $request->all();
        // 該当のIDのオーダーを取得
        $items = Order::where('payment_status', config('define.payment_status_r.success'))->whereIn('id', $id)->with('user')->cursor();
        // 配列の初期化
        $csv_body = [];
        // CSVに必要な項目を配列に格納
        $num = 1;
        foreach ($items as $item){
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
                $item->user->full_name.'('.$item->user->full_name_kana.')',
                $item->user->tel,
                $item->user->email,
                $item->user->delivery_post_code_text ? $item->user->delivery_post_code_text: $item->user->post_code_text,
                $item->user->full_delivery_address ? $item->user->full_delivery_address: $item->user->full_address,
                $item->updated_at,
            ];
            $num++;
        }
        // headerの作成
        $csv_header = ['No', 'ID', '購入日', '購入金額', '支払方法', '希望配達日', '希望配達時間帯', '入金状況', '出荷状況', '購入者(カナ)', '連絡先', 'メールアドレス', '配送先 郵便番号', '配送先 住所', 'ステータス更新日'];
        // 独自helper関数呼び出し
        return csvExport($csv_body,$csv_header,'注文情報出力.csv');
   }
}

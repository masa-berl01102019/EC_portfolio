<?php

namespace App\Http\Controllers\Admin;

use App\Models\Order;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\admin\OrderEditRequest;

class OrderController extends Controller
{
    // TODO Resource APIでレスポンスの返却形式を決めるか要検討
    // TODO フリーワード検索でカラムを指定受けて検索をかける仕様にするか要検討
    // TODO whereHasは処理が重すぎる場合はIN句を使った絞り込みのSQLに変更を検討

    // 該当のカラム以外を扱わないようにホワイトリスト作成
    private $form_items = [ 'is_paid', 'is_shipped' ];

    public function __construct()
    {
        // Auth認証
        $this->middleware('auth:admin');
    }

    public function index(Request $request)
    {
        $search_order = Order::where('payment_status', config('define.payment_status')[0])->select(['orders.id', 'user_id', 'sub_total', 'tax_amount', 'total_amount', 'payment_method', 'is_paid', 'is_shipped', 'created_at', 'updated_at'])->with([
            'user:id,last_name,first_name,last_name_kana,first_name_kana,post_code,prefecture,municipality,street_name,street_number,building,delivery_post_code,delivery_prefecture,delivery_municipality,delivery_street_name,delivery_street_number,delivery_building,tel,email'
        ]);
        // * withで連携すればmodelで定義されたAccesserがシリアライズ時に追加される ex) user.full_name
        // query builderではAccesserが取れない

        // 検索期間の指定フィルター
        $search_order->filterDateRange($request);
        // 支払い方法の指定フィルター
        $search_order->filterPaymentMethod($request);
        // 入金ステータスの指定フィルター
        $search_order->filterIsPaid($request);
        // 配送ステータスの指定フィルター
        $search_order->filterIsShipped($request);

        // 合計金額->作成日順->更新日順の優先順位でソートされる仕組み

        // 合計金額でソート
        $search_order->orderByTotalAmount($request);
        // 作成日でソート
        $search_order->orderByCreatedAt($request);
        // 更新日でソート
        $search_order->orderByUpdatedAt($request);

        // 1ページ当たり件数の指定の有無を確認
        if($request->input('per_page')) {
            $per_page = $request->input('per_page');
            // 取得件数が指定されていた場合はpaginationに引数としてわたしてあげる * 数字にキャストしないと返り値が文字列になってしまうので注意
            $orders = $search_order->paginate((int)$per_page);
        } else {
            // 取得件数が未設定の場合はデフォルトの表示件数　１０件
            $orders = $search_order->paginate(10);
        }

        // レスポンスを返却
        return response()->json([
            'orders' => $orders
        ],200);
    }

    public function edit($order)
    {
        $order = Order::where('payment_status', config('define.payment_status')[0])
        ->where('id', $order)
        ->select(['orders.id', 'sub_total', 'tax_amount', 'total_amount', 'is_paid', 'is_shipped'])
        ->with(['orderDetails:id,order_id,item_name,product_number,order_price,order_color,order_size,order_quantity'])
        ->first();

        // レスポンスを返却
        return response()->json([
            'order' => $order,
        ],200);
    }

    public function update(OrderEditRequest $request, Order $order)
    {
        // 項目制限
        $data = $request->only($this->form_items);
        // 基本情報をDBに保存
        $order->fill([
            'is_paid' => $data['is_paid'],
            'is_shipped' => $data['is_shipped'],
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
        $items = Order::where('payment_status', config('define.payment_status')[0])->whereIn('id', $id)->select(['orders.id', 'user_id', 'sub_total', 'tax_amount', 'total_amount', 'payment_method', 'is_paid', 'is_shipped', 'created_at', 'updated_at'])->with([
            'user:id,last_name,first_name,last_name_kana,first_name_kana,post_code,prefecture,municipality,street_name,street_number,building,delivery_post_code,delivery_prefecture,delivery_municipality,delivery_street_name,delivery_street_number,delivery_building,tel,email'
        ])->cursor();

       // クロージャの中でエラーが起きても、streamDownloadを呼んだ時点でもうヘッダーとかが返っているのでエラーレスポンスが返せない。
       return response()->streamDownload(function () use ($items) {
           // CSVのヘッダー作成
           $csv_header = ['No', 'ID', '購入日', '購入金額', '支払方法', '入金状況', '出荷状況', '購入者(カナ)', '連絡先', 'メールアドレス', '配送先 郵便番号', '配送先 住所', 'ステータス更新日'];
           // SplFileObjectのインスタンスを生成
           $file = new \SplFileObject('php://output', 'w');
           // EXCEL(デフォルトがShift-JIS形式)で開いた時に日本語が文字化けしないように、UTF-8のBOM付きにするためにBOMを書き込み
           $file->fwrite(pack('C*',0xEF,0xBB,0xBF));
           // ヘッダーの読み込み
           $file->fputcsv($csv_header);
           // 一行ずつ連想配列から値を取り出して配列に格納
           $num = 1;

           foreach ($items as $item){
               $file->fputcsv([
                   $num,
                   $item->id,
                   $item->created_at,
                   $item->total_amount_text,
                   $item->payment_method_text,
                   $item->is_paid_text,
                   $item->is_shipped_text,
                   $item->user->full_name.'('.$item->user->full_name_kana.')',
                   $item->user->tel,
                   $item->user->email,
                   $item->user->delivery_post_code_text ? $item->user->delivery_post_code_text: $item->user->post_code_text,
                   $item->user->full_delivery_address ? $item->user->full_delivery_address: $item->user->full_address,
                   $item->updated_at,
               ]);
               $num++;
           }
       }, '注文情報出力.csv', [
           'Content-Type' => 'text/csv'
       ]);
   }
}

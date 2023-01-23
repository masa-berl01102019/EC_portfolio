<!DOCTYPE html>
<html lang="ja">
  <body>
    <p>受注担当者 様</p>
    <h4>受注・決済完了のお知らせ</h4>
    <p>
        {{ $order->user->full_name }} 様より<br>
        下記の内容でご注文を承り、決済を確認したことをお知らせいたします。<br>
        （ご注文金額の金額は、消費税総額表示です）
    </p>
    <p style="width: 100%">
        【決済番号】 {{ $order->id }}<br>
        <span style="display: inline-block; width: 20%">　ご注文主のお名前</span>{{ $order->user->full_name }}<br>
        <span style="display: inline-block; width: 20%">　ご注文日</span>{{ $order->created_at->format('Y年m月d日') }}
    </p>
    <p style="width: 100%">
        【ご注文金額】<br>
        <span style="display: inline-block; width: 20%">　決済合計金額</span>{{ $order->total_amount }}円　（クレジットカード）<br>
        <span style="display: inline-block; width: 20%">（内　消費税</span>{{ $order->tax_amount }}円）
    </p>
    <p style="width: 100%">
        【ご注文商品】<br>
          @foreach($order->orderDetails as $detail)
            <span>　品番：　　{{ $detail->product_number }}</span><br>
            <span>　商品名：　{{ $detail->item_name }}</span><br>
            <span>　サイズ：　{{ $detail->order_size }}</span><br>
            <span>　カラー：　{{ $detail->order_color }}</span><br>
            <span>　数量：　　{{ $detail->order_quantity }}</span><br>
            <span>　価格：　　{{ $detail->order_price }}円 (税別)</span><br><br>
          @endforeach
    </p>
  </body>
</html>
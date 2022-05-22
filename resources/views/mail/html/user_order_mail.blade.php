<!DOCTYPE html>
<html lang="ja">
  <body>
    <p>{{ $order->user->full_name }} 様</p>
    <h4>ご注文・決済完了のお知らせ</h4>
    <p>
        平素は、当社のサービスをご利用いただき、誠にありがとうございます。<br>
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
    <p>
        ※ご注文の決済完了と同時に手配をさせていただいておりますので、<br>
        当サイトを通じてご注文のキャンセル手続きはできません。<br>
        下記運営会社まで直接連絡をお願いいたします。<br>
    </p>
    <p>
        ※このメールは自動送信です。<br>
        返信いただいても回答できませんので、ご了承ください。<br>
        なお、ご不明な点がございましたら、下記の運営会社までお問い合わせください。<br>
    </p>
    <br>
    <hr style="width: 440px;text-align: left;margin-left: 0">
    <p>
        <span style="display: inline-block; width: 70px">運営会社</span>： XXXX運営株式会社<br>
        <span style="display: inline-block; width: 70px">住所</span>： 〒XXX-XXXX テスト県テスト市テスト町1-2-3 テストビルディング 1F<br>
        <span style="display: inline-block; width: 70px">TEL</span>： XX-XXXX-XXXX<br>
        <span style="display: inline-block; width: 70px">E-MAIL</span>： test@example.com<br>
        <span style="display: inline-block; width: 70px">URL</span>： <a href="http://homestead.test">http://homestead.test</a> 
    </p>
    <hr style="width: 440px;text-align: left;margin-left: 0">
    <p>(C) LARAVEL  DEV CO., LTD. ALL RIGHT RESERVED.</p>
  </body>
</html>
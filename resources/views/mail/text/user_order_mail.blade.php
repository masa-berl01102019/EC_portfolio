{{ $order->user->full_name }} 様

ご注文・決済完了のお知らせ

平素は、当社のサービスをご利用いただき、誠にありがとうございます。
下記の内容でご注文を承り、決済を確認したことをお知らせいたします。
（ご注文金額の金額は、消費税総額表示です）

【決済番号】 {{ $order->id }}
　ご注文主のお名前　{{ $order->user->full_name }}
　ご注文日　　　　　{{ $order->created_at->format('Y年m月d日') }}

【ご注文金額】
　決済合計金額　{{ $order->total_amount }}円　（クレジットカード）
　（内　消費税　{{ $order->tax_amount }}円）

【ご注文商品】
@foreach($order->orderDetails as $detail)
　品番：　　{{ $detail->product_number }}
　商品名：　{{ $detail->item_name }}
　サイズ：　{{ $detail->order_size }}
　カラー：　{{ $detail->order_color }}
　数量：　　{{ $detail->order_quantity }}
　価格：　　{{ $detail->order_price }}円 (税別)
　　　
@endforeach

※ご注文の決済完了と同時に手配をさせていただいておりますので、
  当サイトを通じてご注文のキャンセル手続きはできません。
  下記運営会社まで直接連絡をお願いいたします。

※このメールは自動送信です。
  返信いただいても回答できませんので、ご了承ください。
  なお、ご不明な点がございましたら、下記の運営会社までお問い合わせください。


【お問い合わせ先】
　運営会社　： XXXXカンパニー
　住所　　　： 〒XXX-XXXX テスト県テスト市テスト町1-2-3 テストビルディング 1F
　TEL 　　　： XX-XXXX-XXXX
　E-MAIL　　： test@example.com
　URL 　　　： http://homestead.test


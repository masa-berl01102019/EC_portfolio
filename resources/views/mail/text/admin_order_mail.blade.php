受注担当者 様

受注・決済完了のお知らせ

{{ $order->user->full_name }} 様より
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


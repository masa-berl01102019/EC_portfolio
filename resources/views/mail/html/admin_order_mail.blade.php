<!DOCTYPE html>
<html lang="ja">

<body>
  <p>{{ __('mail.admin.order.support_team') }}</p>
  <br>
  <p>
    {{ __('mail.admin.order.p1') }}<br>
    {{ __('mail.admin.order.p2') }}
  </p>
  <p style="width: 100%">
    {{ __('mail.admin.order.order_id') }} {{ $order->id }}<br>
    {{ __('mail.admin.order.full_name') }} {{ $order->user->full_name }}<br>
    {{ __('mail.admin.order.created_at') }} {{ $order->created_at->format('Y-m-d') }}<br>
    {{ __('mail.admin.order.total_amount') }} ¥{{ $order->total_amount }} {{ __('mail.admin.order.tax_amount', ['tax' => $order->tax_amount]) }}<br>
    {{ __('mail.admin.order.payment_method') }} {{ __('mail.admin.order.credit_card') }}<br>
    {{ __('mail.admin.order.order_items') }}<br>
    @foreach($order->orderDetails as $detail)
    <span>　{{ __('mail.admin.order.product_number') }} ： {{ $detail->product_number }}</span><br>
    <span>　{{ __('mail.admin.order.item_name') }} ： {{ $detail->item_name }}</span><br>
    <span>　{{ __('mail.admin.order.order_size') }} ： {{ $detail->order_size }}</span><br>
    <span>　{{ __('mail.admin.order.order_color') }} ： {{ $detail->order_color }}</span><br>
    <span>　{{ __('mail.admin.order.order_quantity') }} ： {{ $detail->order_quantity }}</span><br>
    <span>　{{ __('mail.admin.order.order_price') }} ： ¥{{ $detail->order_price }} {{ __('mail.admin.order.tax_excluded') }}</span><br><br>
    @endforeach
  </p>
</body>

</html>
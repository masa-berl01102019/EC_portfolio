<!DOCTYPE html>
<html lang="ja">

<body>
  <p>{{ __('mail.user.common.honorific', ['name' => $order->user->full_name]) }}</p>
  <br>
  <p>{{ __('mail.user.common.thanks_greeting') }}</p>
  <p>
    {{ __('mail.user.order.p1') }}<br>
    {{ __('mail.user.order.p2') }}
  </p>
  <p style="width: 100%">
    {{ __('mail.user.order.order_id') }} {{ $order->id }}<br>
    {{ __('mail.user.order.full_name') }} {{ $order->user->full_name }}<br>
    {{ __('mail.user.order.created_at') }} {{ $order->created_at->format('Y-m-d') }}<br>
    {{ __('mail.user.order.total_amount') }} ¥{{ $order->total_amount }} {{ __('mail.user.order.tax_amount', ['tax' => $order->tax_amount]) }}<br>
    {{ __('mail.user.order.payment_method') }} {{ __('mail.user.order.credit_card') }}<br>
    {{ __('mail.user.order.order_items') }}<br>
    @foreach($order->orderDetails as $detail)
    <span>　{{ __('mail.user.order.product_number') }} ： {{ $detail->product_number }}</span><br>
    <span>　{{ __('mail.user.order.item_name') }} ： {{ $detail->item_name }}</span><br>
    <span>　{{ __('mail.user.order.order_size') }} ： {{ $detail->order_size }}</span><br>
    <span>　{{ __('mail.user.order.order_color') }} ： {{ $detail->order_color }}</span><br>
    <span>　{{ __('mail.user.order.order_quantity') }} ： {{ $detail->order_quantity }}</span><br>
    <span>　{{ __('mail.user.order.order_price') }} ： ¥{{ $detail->order_price }} {{ __('mail.user.order.tax_excluded') }}</span><br><br>
    @endforeach
  </p>
  <p>
    {{ __('mail.user.order.notice1') }}<br>
    {{ __('mail.user.order.notice2') }}<br>
    {{ __('mail.user.order.notice3') }}<br>
  </p>
  <p>
    {{ __('mail.user.common.noreply_notice1') }}<br>
    {{ __('mail.user.common.noreply_notice2') }}<br>
    {{ __('mail.user.common.noreply_notice3') }}<br>
  </p>
  <br>
  <hr style="width: 440px;text-align: left;margin-left: 0">
  <p>
    {{ __('mail.user.common.company') }} ： {{ __('mail.user.common.company_ex') }}<br>
    {{ __('mail.user.common.address') }} ： {{ __('mail.user.common.address_ex') }}<br>
    TEL ： XX-XXXX-XXXX<br>
    EMAIL ： test@example.com<br>
    URL ： <a href="http://homestead.test">http://homestead.test</a>
  </p>
  <hr style="width: 440px;text-align: left;margin-left: 0">
  <p>(C) DEMO DEV CO., LTD. ALL RIGHT RESERVED.</p>
</body>

</html>
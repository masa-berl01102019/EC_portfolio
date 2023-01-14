{{ __('mail.user.common.honorific', ['name' => $order->user->full_name]) }}


{{ __('mail.user.common.thanks_greeting') }}

{{ __('mail.user.order.p1') }}
{{ __('mail.user.order.p2') }}

{{ __('mail.user.order.order_id') }} {{ $order->payment_token }}
{{ __('mail.user.order.full_name') }} {{ $order->user->full_name }}
{{ __('mail.user.order.created_at') }} {{ $order->created_at->format('Y-m-d') }}
{{ __('mail.user.order.total_amount') }} ¥{{ $order->total_amount }} {{ __('mail.user.order.tax_amount', ['tax' => $order->tax_amount]) }}
{{ __('mail.user.order.payment_method') }} {{ __('mail.user.order.credit_card') }}
{{ __('mail.user.order.order_items') }}
@foreach($order->orderDetails as $detail)
　{{ __('mail.user.order.product_number') }} ： {{ $detail->product_number }}
　{{ __('mail.user.order.item_name') }} ： {{ $detail->item_name }}
　{{ __('mail.user.order.order_size') }} ： {{ $detail->order_size }}
　{{ __('mail.user.order.order_color') }} ： {{ $detail->order_color }}
　{{ __('mail.user.order.order_quantity') }} ： {{ $detail->order_quantity }}
　{{ __('mail.user.order.order_price') }} ： {{ $detail->order_price }} {{ __('mail.user.order.tax_excluded') }}
　　　
@endforeach

{{ __('mail.user.order.notice1') }}
{{ __('mail.user.order.notice2') }}
{{ __('mail.user.order.notice3') }}

{{ __('mail.user.common.noreply_notice1') }}
{{ __('mail.user.common.noreply_notice2') }}
{{ __('mail.user.common.noreply_notice3') }}


{{ __('mail.user.common.contact') }}
　{{ __('mail.user.common.company') }} ： {{ __('mail.user.common.company_ex') }}
　{{ __('mail.user.common.address') }} ： {{ __('mail.user.common.address_ex') }}
　TEL ： XX-XXXX-XXXX
　EMAIL ： test@example.com
　URL ： http://homestead.test
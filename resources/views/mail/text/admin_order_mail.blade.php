{{ __('mail.admin.order.support_team') }}


{{ __('mail.admin.order.p1') }}
{{ __('mail.admin.order.p2') }}

{{ __('mail.admin.order.order_id') }} {{ $order->payment_token }}
{{ __('mail.admin.order.full_name') }} {{ $order->user->full_name }}
{{ __('mail.admin.order.created_at') }} {{ $order->created_at->format('Y-m-d') }}
{{ __('mail.admin.order.total_amount') }} ¥{{ $order->total_amount }} {{ __('mail.admin.order.tax_amount', ['tax' => $order->tax_amount]) }}
{{ __('mail.admin.order.payment_method') }} {{ __('mail.admin.order.credit_card') }}
{{ __('mail.admin.order.order_items') }}
@foreach($order->orderDetails as $detail)
　{{ __('mail.admin.order.product_number') }} ： {{ $detail->product_number }}
　{{ __('mail.admin.order.item_name') }} ： {{ $detail->item_name }}
　{{ __('mail.admin.order.order_size') }} ： {{ $detail->order_size }}
　{{ __('mail.admin.order.order_color') }} ： {{ $detail->order_color }}
　{{ __('mail.admin.order.order_quantity') }} ： {{ $detail->order_quantity }}
　{{ __('mail.admin.order.order_price') }} ： {{ $detail->order_price }} {{ __('mail.admin.order.tax_excluded') }}
　　　
@endforeach
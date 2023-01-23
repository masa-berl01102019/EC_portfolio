{{ __('mail.user.common.honorific', ['name' => $user_name]) }}


{{ __('mail.user.common.thanks_greeting') }}

{{ __('mail.user.reset_password.p1') }}

{{ __('mail.user.reset_password.p2') }}

{{ __('mail.user.reset_password.p3') }}
　{{'http://homestead.test/user/change_password/'.$password_reset->uuid}}

{{ __('mail.user.reset_password.p5') }}
　{{ $password_reset->expired_at->format('Y-m-d H:i') }}

{{ __('mail.user.reset_password.p6') }}
{{ __('mail.user.reset_password.p7') }}

{{ __('mail.user.reset_password.p8') }}
{{ __('mail.user.reset_password.p9') }}
{{ __('mail.user.reset_password.p10') }}

{{ __('mail.user.common.noreply_notice1') }}
{{ __('mail.user.common.noreply_notice2') }}
{{ __('mail.user.common.noreply_notice3') }}


{{ __('mail.user.common.contact') }}
　{{ __('mail.user.common.company') }} ： {{ __('mail.user.common.company_ex') }}
　{{ __('mail.user.common.address') }} ： {{ __('mail.user.common.address_ex') }}
　TEL ： XX-XXXX-XXXX
　EMAIL ： test@example.com
　URL ： http://homestead.test
{{ __('mail.admin.reset_password.honorific', ['name' => $admin_name]) }}


{{ __('mail.admin.reset_password.p1') }}

{{ __('mail.admin.reset_password.p2') }}

{{ __('mail.admin.reset_password.p3') }}
　{{'http://homestead.test/admin/change_password/'.$password_reset->uuid}}

{{ __('mail.admin.reset_password.p5') }}
　{{ $password_reset->expired_at->format('Y-m-d H:i') }}

{{ __('mail.admin.reset_password.p6') }}
{{ __('mail.admin.reset_password.p7') }}

{{ __('mail.admin.reset_password.p8') }}
{{ __('mail.admin.reset_password.p9') }}
{{ __('mail.admin.reset_password.p10') }}
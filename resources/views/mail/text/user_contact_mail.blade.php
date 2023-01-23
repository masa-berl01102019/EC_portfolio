{{ __('mail.user.common.honorific', ['name' => $contact->full_name]) }}


{{ __('mail.user.common.thanks_greeting') }}

{{ __('mail.user.contact.p1') }}

{{ __('mail.user.contact.created_at') }}
　{{ $contact->created_at->format('Y-m-d') }}

{{ __('mail.user.contact.subject2') }}
　{{ $contact->subject }}

{{ __('mail.user.contact.message') }}
　{{ $contact->message }}

{{ __('mail.user.contact.notice1') }}
{{ __('mail.user.contact.notice2') }}
{{ __('mail.user.contact.notice3') }}

{{ __('mail.user.common.noreply_notice1') }}
{{ __('mail.user.common.noreply_notice2') }}
{{ __('mail.user.common.noreply_notice3') }}


{{ __('mail.user.common.contact') }}
　{{ __('mail.user.common.company') }} ： {{ __('mail.user.common.company_ex') }}
　{{ __('mail.user.common.address') }} ： {{ __('mail.user.common.address_ex') }}
　TEL ： XX-XXXX-XXXX
　EMAIL ： test@example.com
　URL ： http://homestead.test
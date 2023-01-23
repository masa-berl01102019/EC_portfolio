{{ __('mail.admin.contact.support_team') }}


{{ __('mail.admin.contact.p1') }}

{{ __('mail.admin.contact.created_at') }}
　{{ $contact->created_at->format('Y-m-d') }}

{{ __('mail.admin.contact.user_name') }}
　{{ $contact->full_name }}

{{ __('mail.admin.contact.email') }}
　{{ $contact->email }}

{{ __('mail.admin.contact.subject2') }}
　{{ $contact->subject }}

{{ __('mail.admin.contact.message') }}
　{{ $contact->message }}
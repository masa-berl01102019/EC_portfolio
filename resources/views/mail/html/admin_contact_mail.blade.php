<!DOCTYPE html>
<html lang="ja">

<body>
  <p>{{ __('mail.admin.contact.support_team') }}</p>
  <br>
  <p>{{ __('mail.admin.contact.p1') }}</p>
  <p style="width: 100%">
    {{ __('mail.admin.contact.created_at') }}<br>
    {{ $contact->created_at->format('Y-m-d') }}<br>
  </p>
  <p style="width: 100%">
    {{ __('mail.admin.contact.user_name') }}<br>
    {{ $contact->full_name }}<br>
  </p>
  <p style="width: 100%">
    {{ __('mail.admin.contact.email') }}<br>
    {{ $contact->email }}<br>
  </p>
  <p style="width: 100%">
    {{ __('mail.admin.contact.subject2') }}<br>
    {{ $contact->subject }}<br>
  </p>
  <p style="width: 100%">
    {{ __('mail.admin.contact.message') }}<br>
    {{ $contact->message }}<br>
  </p>
</body>

</html>
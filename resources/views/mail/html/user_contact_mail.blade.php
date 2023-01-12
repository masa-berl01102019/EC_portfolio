<!DOCTYPE html>
<html lang="ja">

<body>
  <p>{{ __('mail.user.common.honorific', ['name' => $contact->full_name]) }}</p>
  <br>
  <p>{{ __('mail.user.common.thanks_greeting') }}</p>
  <p>{{ __('mail.user.contact.p1') }}</p>
  <p style="width: 100%">
    {{ __('mail.user.contact.created_at') }}<br>
    {{ $contact->created_at->format('Y-m-d') }}<br>
  </p>
  <p style="width: 100%">
    {{ __('mail.user.contact.subject2') }}<br>
    {{ $contact->subject }}<br>
  </p>
  <p style="width: 100%">
    {{ __('mail.user.contact.message') }}<br>
    {{ $contact->message }}<br>
  </p>
  <p>
    {{ __('mail.user.contact.notice1') }}<br>
    {{ __('mail.user.contact.notice2') }}<br>
    {{ __('mail.user.contact.notice3') }}<br>
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
<!DOCTYPE html>
<html lang="ja">

<body>
  <p>{{ __('mail.user.common.honorific', ['name' => $user_name]) }}</p>
  <br>
  <p>{{ __('mail.user.common.thanks_greeting') }}</p>
  <p>{{ __('mail.user.change_password.p1') }}</p>
  <p>{{ __('mail.user.change_password.p2') }}</p>
  <p>{{ __('mail.user.change_password.p3') }}</p>
  <p style="width: 100%">
    {{ __('mail.user.change_password.p4') }}<br>
    <a href="http://homestead.test/user/reset_password">
      {{ __('mail.user.change_password.p5') }}
    </a>
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
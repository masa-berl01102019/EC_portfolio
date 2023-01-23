<!DOCTYPE html>
<html lang="ja">

<body>
  <p>{{ __('mail.user.common.honorific', ['name' => $user_name]) }}</p>
  <br>
  <p>{{ __('mail.user.common.thanks_greeting') }}</p>
  <p>{{ __('mail.user.reset_password.p1') }}</p>
  <p>{{ __('mail.user.reset_password.p2') }}</p>
  <p style="width: 100%">
    {{ __('mail.user.reset_password.p3') }}<br>
    <a href="{{'http://homestead.test/user/change_password/'.$password_reset->uuid}}">
      {{ __('mail.user.reset_password.p4') }}
    </a>
    <br>
  </p>
  <p style="width: 100%">
    {{ __('mail.user.reset_password.p5') }}<br>
    {{ $password_reset->expired_at->format('Y-m-d H:i') }}<br>
  </p>
  <p>
    {{ __('mail.user.reset_password.p6') }}<br>
    {{ __('mail.user.reset_password.p7') }}
  </p>
  <p>
    {{ __('mail.user.reset_password.p8') }}<br>
    {{ __('mail.user.reset_password.p9') }}<br>
    {{ __('mail.user.reset_password.p10') }}
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
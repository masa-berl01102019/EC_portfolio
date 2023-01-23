<!DOCTYPE html>
<html lang="ja">

<body>
  <p>{{ __('mail.admin.reset_password.honorific', ['name' => $admin_name]) }}</p>
  <br>
  <p>{{ __('mail.admin.reset_password.p1') }}</p>
  <p>{{ __('mail.admin.reset_password.p2') }}</p>
  <p style="width: 100%">
    {{ __('mail.admin.reset_password.p3') }}<br>
    <a href="{{'http://homestead.test/admin/change_password/'.$password_reset->uuid}}">
      {{ __('mail.admin.reset_password.p4') }}
    </a>
    <br>
  </p>
  <p style="width: 100%">
    {{ __('mail.admin.reset_password.p5') }}<br>
    {{ $password_reset->expired_at->format('Y-m-d H:i') }}<br>
  </p>
  <p>
    {{ __('mail.admin.reset_password.p6') }}<br>
    {{ __('mail.admin.reset_password.p7') }}
  </p>
  <p>
    {{ __('mail.admin.reset_password.p8') }}<br>
    {{ __('mail.admin.reset_password.p9') }}<br>
    {{ __('mail.admin.reset_password.p10') }}
  </p>
</body>

</html>
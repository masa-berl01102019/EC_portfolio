<!DOCTYPE html>
<html lang="ja">

<body>
  <p>{{ __('mail.admin.change_password.honorific', ['name' => $admin_name]) }}</p>
  <br>
  <p>{{ __('mail.admin.change_password.p1') }}</p>
  <p>{{ __('mail.admin.change_password.p2') }}</p>
  <p>{{ __('mail.admin.change_password.p3') }}</p>
  <p style="width: 100%">
    {{ __('mail.admin.change_password.p4') }}<br>
    <a href="http://homestead.test/admin/reset_password">
      {{ __('mail.admin.change_password.p5') }}
    </a>
  </p>
</body>

</html>
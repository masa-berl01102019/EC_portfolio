<!DOCTYPE html>
<html lang="ja">

<body>
  <p>{{ $admin_name }} 様</p>
  <h4>パスワード再設定について</h4>
  <p>
    パスワード再設定のリクエストを承りましたことをお知らせいたします。<br>
  </p><br>

  <p>以下のリンクをクリックしてパスワードを変更出来ます。</p>
  <p style="width: 100%">
    【パスワード再設定リンク】<br>
    <a href="{{'http://homestead.test/admin/change_password/'.$password_reset->uuid}}">パスワード再設定はこちらから</a><br>
  </p>
  <p style="width: 100%">
    【パスワード再設定の有効期限】<br>
    {{ $password_reset->expired_at->format('Y年m月d日 H時i分') }}<br>
  </p>

  <p>
    もしあなたがパスワード再設定をリクエストしていない場合は、このメールを無視して下さい。<br>
    上記リンクをクリックして新しいパスワードを作成しない限り、パスワードは変更されません。<br>
    上記のリンクには有効期限がございます。<br>
    有効期限を過ぎた場合は上記のリンクにアクセス出来なくなります。<br>
    予めご了承のほど、何卒宜しくお願い申し上げます。<br>
  </p>
</body>

</html>
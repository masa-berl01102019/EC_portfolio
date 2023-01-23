<!DOCTYPE html>
<html lang="ja">

<body>
  <p>{{ $user_name }} 様</p>
  <h4>パスワード再設定について</h4>
  <p>
    平素は、当社のサービスをご利用いただき、誠にありがとうございます。<br>
    パスワード再設定のリクエストを承りましたことをお知らせいたします。<br>
  </p><br>

  <p>以下のリンクをクリックしてパスワードを変更出来ます。</p>
  <p style="width: 100%">
    【パスワード再設定リンク】<br>
    <a href="{{'http://homestead.test/user/change_password/'.$password_reset->uuid}}">パスワード再設定はこちらから</a><br>
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
  <br>
  <p>
    ※このメールは自動送信です。<br>
    返信いただいても回答できませんので、ご了承ください。<br>
    なお、ご不明な点がございましたら、下記の運営会社までお問い合わせください。<br>
  </p>
  <br>
  <hr style="width: 440px;text-align: left;margin-left: 0">
  <p>
    <span style="display: inline-block; width: 70px">運営会社</span>： XXXX運営株式会社<br>
    <span style="display: inline-block; width: 70px">住所</span>： 〒XXX-XXXX テスト県テスト市テスト町1-2-3 テストビルディング 1F<br>
    <span style="display: inline-block; width: 70px">TEL</span>： XX-XXXX-XXXX<br>
    <span style="display: inline-block; width: 70px">E-MAIL</span>： test@example.com<br>
    <span style="display: inline-block; width: 70px">URL</span>： <a href="http://homestead.test">http://homestead.test</a>
  </p>
  <hr style="width: 440px;text-align: left;margin-left: 0">
  <p>(C) LARAVEL DEV CO., LTD. ALL RIGHT RESERVED.</p>
</body>

</html>
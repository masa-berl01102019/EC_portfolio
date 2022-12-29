<!DOCTYPE html>
<html lang="ja">

<body>
  <p>{{ $contact->full_name }} 様</p>
  <h4>お問い合わせ完了のお知らせ</h4>
  <p>
    平素は、当社のサービスをご利用いただき、誠にありがとうございます。<br>
    下記の内容でお問い合わせを承りましたことをお知らせいたします。<br>
  </p>
  <p>
    お問い合わせ日　{{ $contact->created_at->format('Y年m月d日') }}
  </p>
  <p style="width: 100%">
    【お問い合わせタイトル】<br>
    {{ $contact->subject }}<br>
  </p>
  <p style="width: 100%">
    【お問い合わせ内容】<br>
    {{ $contact->message }}<br>
  </p>
  <p>
    お問い合わせ頂いた内容につきましては後日、<br>
    担当者よりご登録頂いたメールアドレス宛てに返信させて頂きます。<br>
    返信にはお問い合わせ状況によって、数日かかる場合が御座います。<br>
    予めご了承のほど、何卒宜しくお願い申し上げます。<br>
  </p>
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
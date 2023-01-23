<!DOCTYPE html>
<html lang="ja">
  <body>
    <p>お問い合わせサポート担当者 様</p>
    <h4>お問い合わせのお知らせ</h4>
    <p>
        {{ $contact->full_name }} 様より<br>
        下記の内容でお問い合わせを承りましたことをお知らせいたします。<br>
    </p>
    <p>
      お問い合わせ日　{{ $contact->created_at->format('Y年m月d日') }}
    </p>
    <p style="width: 100%">
        【お問い合わせタイトル】<br>
        {{ $contact->title }}<br>
    </p>
    <p style="width: 100%">
        【お問い合わせ内容】<br>
        {{ $contact->body }}<br>
    </p>
  </body>
</html>
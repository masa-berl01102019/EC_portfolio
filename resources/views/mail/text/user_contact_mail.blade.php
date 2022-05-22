{{ $contact->full_name }} 様

お問い合わせ完了のお知らせ
    
平素は、当社のサービスをご利用いただき、誠にありがとうございます。
下記の内容でお問い合わせを承りましたことをお知らせいたします。

お問い合わせ日　{{ $contact->created_at->format('Y年m月d日') }}

【お問い合わせタイトル】 
　{{ $contact->title }}

【お問い合わせ内容】
　{{ $contact->body }}
    
お問い合わせ頂いた内容につきましては後日、
担当者よりご登録頂いたメールアドレス宛てに返信させて頂きます。
返信にはお問い合わせ状況によって、数日かかる場合が御座います。
予めご了承のほど、何卒宜しくお願い申し上げます。

※このメールは自動送信です。
  返信いただいても回答できませんので、ご了承ください。
  なお、ご不明な点がございましたら、下記の運営会社までお問い合わせください。

【お問い合わせ先】
　運営会社　： XXXXカンパニー
　住所　　　： 〒XXX-XXXX テスト県テスト市テスト町1-2-3 テストビルディング 1F
　TEL 　　　： XX-XXXX-XXXX
　E-MAIL　　： test@example.com
　URL 　　　： http://homestead.test
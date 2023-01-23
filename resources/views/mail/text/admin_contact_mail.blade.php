お問い合わせサポート担当者 様

お問い合わせのお知らせ
    
{{ $contact->full_name }} 様より
下記の内容でお問い合わせを承りましたことをお知らせいたします。

お問い合わせ日　{{ $contact->created_at->format('Y年m月d日') }}

【お問い合わせタイトル】 
　{{ $contact->title }}

【お問い合わせ内容】
　{{ $contact->body }}
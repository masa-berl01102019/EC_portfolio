<?php

return [

    /*
      |--------------------------------------------------------------------------
      | Validation Language Lines
      | 検証言語
      |--------------------------------------------------------------------------
      |
      | The following language lines contain the default error messages used by
      | the validator class. Some of these rules have multiple versions such
      | as the size rules. Feel free to tweak each of these messages here.
      |
      | 次の言語行には、バリデータークラスで使用されるデフォルトのエラーメッセージが含まれています。
      | これらの規則の中には、サイズ規則などの複数のバージョンがあります。
      | これらのメッセージのそれぞれをここで微調整してください。
    */

    'accepted'             => ':attribute が未承認です',
    'active_url'           => ':attribute は有効なURLではありません',
    'after'                => ':attribute は :date より後の日付にしてください',
    'after_or_equal'       => ':attribute は :date 以降の日付にしてください',
    'alpha'                => ':attribute は英字のみ有効です',
    'alpha_dash'           => ':attribute は「英字」「数字」「-(ダッシュ)」「_(下線)」のみ有効です',
    'alpha_num'            => ':attribute は「英字」「数字」のみ有効です',
    'array'                => ':attribute は配列タイプのみ有効です',
    'before'               => ':attribute は :date より前の日付にしてください',
    'before_or_equal'      => ':attribute は :date 以前の日付にしてください',
    'between'              => [
        'numeric' => ':attribute は :min ～ :max までの数値まで有効です',
        'file'    => ':attribute は :min ～ :max キロバイトまで有効です',
        'string'  => ':attribute は :min ～ :max 文字まで有効です',
        'array'   => ':attribute は :min ～ :max 個まで有効です',
    ],
    'boolean'              => ':attribute の値は true もしくは false のみ有効です',
    'confirmed'            => ':attribute を確認用と一致させてください',
    'date'                 => ':attribute を有効な日付形式にしてください',
    'date_format'          => ':attribute を :format 書式と一致させてください',
    'different'            => ':attribute を :other と違うものにしてください',
    'digits'               => ':attribute は :digits 桁のみ有効です',
    'digits_between'       => ':attribute は :min ～ :max 桁のみ有効です',
    'dimensions'           => ':attribute ルールに合致する画像サイズのみ有効です',
    'distinct'             => ':attribute に重複している値があります',
    'email'                => ':attribute の書式のみ有効です',
    'exists'               => ':attribute 無効な値です',
    'file'                 => ':attribute アップロード出来ないファイルです',
    'filled'               => ':attribute 値を入力してください',
    'gt'                   => [
        'numeric' => ':attribute は :value より大きい必要があります。',
        'file'    => ':attributeは :value キロバイトより大きい必要があります。',
        'string'  => ':attribute は :value 文字より多い必要があります。',
        'array'   => ':attribute には :value 個より多くの項目が必要です。',
    ],
    'gte'                  => [
        'numeric' => ':attribute は :value 以上である必要があります。',
        'file'    => ':attribute は :value キロバイト以上である必要があります。',
        'string'  => ':attribute は :value 文字以上である必要があります。',
        'array'   => ':attribute には value 個以上の項目が必要です。',
    ],
    'image'                => ':attribute 画像は「jpg」「png」「bmp」「gif」「svg」のみ有効です',
    'in'                   => ':attribute 無効な値です',
    'in_array'             => ':attribute は :other と一致する必要があります',
    'integer'              => ':attribute は整数のみ有効です',
    'ip'                   => ':attribute IPアドレスの書式のみ有効です',
    'ipv4'                 => ':attribute IPアドレス(IPv4)の書式のみ有効です',
    'ipv6'                 => ':attribute IPアドレス(IPv6)の書式のみ有効です',
    'json'                 => ':attribute 正しいJSON文字列のみ有効です',
    'lt'                   => [
        'numeric' => ':attribute は :value 未満である必要があります。',
        'file'    => ':attribute は :value キロバイト未満である必要があります。',
        'string'  => ':attribute は :value 文字未満である必要があります。',
        'array'   => ':attribute は :value 未満の項目を持つ必要があります。',
    ],
    'lte'                  => [
        'numeric' => ':attribute は :value 以下である必要があります。',
        'file'    => ':attribute は :value キロバイト以下である必要があります。',
        'string'  => ':attribute は :value 文字以下である必要があります。',
        'array'   => ':attribute は :value 以上の項目を持つ必要があります。',
    ],
    'max'                  => [
        'numeric' => ':attribute は :max 以下のみ有効です',
        'file'    => ':attribute は :max KB以下のファイルのみ有効です',
        'string'  => ':attribute は :max 文字以下のみ有効です',
        'array'   => ':attribute は :max 個以下のみ有効です',
    ],
    'mimes'                => ':attribute は :values タイプのみ有効です',
    'mimetypes'            => ':attribute は :values タイプのみ有効です',
    'min'                  => [
        'numeric' => ':attribute は :min 以上のみ有効です',
        'file'    => ':attribute は :min KB以上のファイルのみ有効です',
        'string'  => ':attribute は :min 文字以上のみ有効です',
        'array'   => ':attribute は :min 個以上のみ有効です',
    ],
    'not_in'               => ':attribute 無効な値です',
    'not_regex'            => 'The :attribute format is invalid.',
    'numeric'              => ':attribute は数字のみ有効です',
    'present'              => ':attribute が存在しません',
    'password'              => '登録されてる:attributeと一致しません',
    'regex'                => ':attribute 無効な値です',
    'required'             => ':attribute は必須です',
    'required_if'          => ':attribute は :other が :value には必須です',
    'required_unless'      => ':attribute は :other が :values でなければ必須です',
    'required_with'        => ':attribute は :values が入力されている場合は必須です',
    'required_with_all'    => ':attribute は :values が入力されている場合は必須です',
    'required_without'     => ':attribute は :values が入力されていない場合は必須です',
    'required_without_all' => ':attribute は :values が入力されていない場合は必須です',
    'same'                 => ':attribute は :other と同じ場合のみ有効です',
    'size'                 => [
        'numeric' => ':attribute は :size のみ有効です',
        'file'    => ':attribute は :size KBのみ有効です',
        'string'  => ':attribute は :size 文字のみ有効です',
        'array'   => ':attribute は :size 個のみ有効です',
    ],
    'string'               => ':attribute は文字列のみ有効です',
    'timezone'             => ':attribute 正しいタイムゾーンのみ有効です',
    'unique'               => ':attribute は既に存在します',
    'uploaded'             => ':attribute アップロードに失敗しました',
    'url'                  => ':attribute は正しいURL書式のみ有効です',
    // 独自ルール
    'kana'                 => ':attribute はひらがなもしくはカタカナのみ有効です',
    'japanese_post_code'   => ':attribute はハイフンなし7桁の数字のみ有効です',
    'japanese_phone_number' => ':attribute は国内の電話番号のみ有効です',

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Language Lines
    | カスタム検証言語
    |--------------------------------------------------------------------------
    |
    | Here you may specify custom validation messages for attributes using the
    | convention "attribute.rule" to name the lines. This makes it quick to
    | specify a specific custom language line for a given attribute rule.
    |
    | ここでは、行に名前を付けるために "attribute.rule"という規則を使って属性のカスタム
    | 検証メッセージを指定することができます。 これにより、特定の属性ルールに対して特定の
    | カスタム言語行をすばやく指定できます。
    |
    */

    'custom' => [
        // USER ORDERS
        'delivery_date' => [
            'after' => 'ご希望配達日には、明日以降の日付を指定してください。',
        ]
    ],

    /*
      |--------------------------------------------------------------------------
      | Custom Validation Attributes
      | カスタム検証属性
      |--------------------------------------------------------------------------
      |
      | The following language lines are used to swap attribute place-holders
      | with something more reader friendly such as E-Mail Address instead
      | of "email". This simply helps us make messages a little cleaner.
      |
      | 次の言語行は、属性プレースホルダを「email」ではなく「E-Mail Address」などの
      | 読みやすいものと交換するために使用されます。
      |
    */

    'attributes' => [
        // ADMIN ADMINS
        'last_name' => '姓',
        'first_name' => '名',
        'last_name_kana' => '姓(カナ)',
        'first_name_kana' => '名(カナ)',
        'tel' => '電話番号',
        'email' => 'メールアドレス',
        'password' => 'パスワード',
        // ADMIN BLOGS
        'title' => 'タイトル',
        'body' => '本文',
        'brand_id' => 'ブランドカテゴリー',
        'category_id' => '性別カテゴリー',
        'items_id.*' => '関連品番',
        'tags_id.*' => '関連タグ',
        'is_published' => '公開設定',
        'file' => 'サムネイル',
        'thumbnail' => 'サムネイル',
        // ADMIN BRANDS
        'brand_name' => 'ブランド名',
        // ADMIN CATEGORY
        'category_name' => 'カテゴリー名',
        'parent_id' => '親カテゴリーID',
        // ADMIN COLORS
        'color_name' => 'カラー名',
        // ADMIN CONTACTS
        'response_status' => '対応状況',
        'memo' => '備考欄',
        // ADMIN ITEMS
        'product_number' => '品番',
        'item_name' => '商品名',
        'price' => '価格',
        'cost' => '原価',
        'made_in' => '生産国',
        'mixture_ratio' => '混用率',
        'description' => '商品説明',
        // 'is_published' => '公開設定',
        // 'brand_id' => 'ブランドカテゴリー',
        'gender_category' => '性別カテゴリー',
        'main_category' => 'メインカテゴリー',
        'sub_category' => 'サブカテゴリー',
        // 'tags_id.*' => '関連タグ',
        'skus.*.id' => 'SKU ID',
        'skus.*.item_id' => '商品ID',
        'skus.*.size_id' => 'サイズ',
        'skus.*.color_id' => 'カラー',
        'skus.*.quantity' => '在庫数',
        'images.*.id' => '画像ID',
        'images.*.item_id' => '商品ID',
        'images.*.color_id' => '関連カラー',
        'images.*.image' => '画像',
        'images.*.image_category' => '画像種別',
        'images.*.file' => '画像ファイル',
        'measurements.*.id' => '寸法ID',
        'measurements.*.size_id' => 'サイズ',
        'measurements.*.width' => '身幅',
        'measurements.*.shoulder_width' => '肩幅',
        'measurements.*.raglan_sleeve_length' => '裄丈',
        'measurements.*.sleeve_length' => '袖丈',
        'measurements.*.length' => '着丈',
        'measurements.*.waist' => 'ウエスト',
        'measurements.*.hip' => 'ヒップ',
        'measurements.*.rise' => '股上',
        'measurements.*.inseam' => '股下',
        'measurements.*.thigh_width' => 'わたり',
        'measurements.*.outseam' => 'パンツ総丈',
        'measurements.*.sk_length' => 'スカート丈',
        'measurements.*.hem_width' => '裾幅',
        'measurements.*.weight' => '重量',
        // ADMIN NEWS
        // 'title' => 'タイトル',
        // 'body' => '本文',
        // 'brand_id' => 'ブランドカテゴリー',
        // 'category_id' => '性別カテゴリー',
        // 'tags_id.*' => '関連タグ',
        // 'is_published' => '公開設定',
        // 'file' => 'サムネイル',
        // 'thumbnail' => 'サムネイル',
        // ADMIN NOTIFICATIONS
        // 'title' => 'タイトル',
        // 'body' => '本文',
        // 'is_published' => '公開設定',
        'expired_at' => '掲載終了日',
        // ADMIN ORDERS
        'is_paid' => '入金状況',
        'is_shipped' => '出荷状況',
        'delivery_date' => '希望配達日',
        'delivery_time' => '希望配達時間帯',
        // ADMIN RESET_PASSWORDS
        'uuid' => 'ユニークキー',
        // 'password' => 'パスワード',
        // 'email' => 'メールアドレス',
        // ADMIN SIZES
        'size_name' => 'サイズ名',
        // ADMIN TAGS
        'tag_name' => 'タグ名',
        // ADMIN USERS
        // 'last_name' => '姓',
        // 'first_name' => '名',
        // 'last_name_kana' => '姓(カナ)',
        // 'first_name_kana' => '名(カナ)',
        'gender' => '性別',
        'birthday' => '生年月日',
        'post_code' => '郵便番号',
        'prefecture' => '都道府県',
        'municipality' => '市区町村郡',
        'street_name' => '町名',
        'street_number' => '丁目番地',
        'building' => '建物名',
        'delivery_post_code' => '郵便番号',
        'delivery_prefecture' => '都道府県',
        'delivery_municipality' => '市区町村郡',
        'delivery_street_name' => '町名',
        'delivery_street_number' => '丁目番地',
        'delivery_building' => '建物名',
        // 'tel' => '電話番号',
        // 'email' => 'メールアドレス',
        // 'password' => 'パスワード',
        'is_received' => 'DM登録',
        // USER BOOKMARKS
        'sku_id' => 'SKU ID',
        // USER CARTS
        'quantity' => '数量',
        // 'sku_id' => 'SKU ID',
        // USER CONTACTS
        // 'last_name' => '姓',
        // 'first_name' => '名',
        // 'last_name_kana' => '姓(カナ)',
        // 'first_name_kana' => '名(カナ)',
        // 'tel' => '電話番号',
        // 'email' => 'メールアドレス',
        'subject' => '件名',
        'message' => '本文',
        // USER ORDERS
        'payment_token' => '決済トークン',
        'total_amount' => '請求合計',
        'payment_method' => '支払い方法',
        // 'delivery_date' => '希望配達日', // フロントでは配達日
        // 'delivery_time' => '希望配達時間帯', // フロントでは配達時間帯
        // USER RESET_PASSWORDS
        // 'uuid' => 'ユニークキー',
        // 'password' => 'パスワード',
        // 'email' => 'メールアドレス',
        // USER USERS
        // 'last_name' => '姓',
        // 'first_name' => '名',
        // 'last_name_kana' => '姓(カナ)',
        // 'first_name_kana' => '名(カナ)',
        // 'gender' => '性別',
        // 'birthday' => '生年月日',
        // 'post_code' => '郵便番号',
        // 'prefecture' => '都道府県',
        // 'municipality' => '市区町村郡',
        // 'street_name' => '町名',
        // 'street_number' => '丁目番地',
        // 'building' => '建物名',
        // 'delivery_post_code' => '郵便番号',
        // 'delivery_prefecture' => '都道府県',
        // 'delivery_municipality' => '市区町村郡',
        // 'delivery_street_name' => '町名',
        // 'delivery_street_number' => '丁目番地',
        // 'delivery_building' => '建物名',
        // 'tel' => '電話番号',
        // 'email' => 'メールアドレス',
        // 'is_received' => 'DM登録',
        // 'password' => 'パスワード'
    ],

];

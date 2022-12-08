export const validationConfig = {
  admin : {
    admin_create : {
      rules : {
        'last_name': 'required|string|max:25',
        'first_name': 'required|string|max:25',
        'last_name_kana': 'required|string|max:25', // かな判定追加する 必須にしない
        'first_name_kana': 'required|string|max:25', // かな判定追加する 必須にしない
        'tel': 'required|string|max:15', // 日本のサービスなので日本語の電話番号かの判定ロジック必要
        'email': 'required|email|max:100',
        'password': 'required|string|alpha_num|min:8|max:100'
      },
      attributes : { 
        'last_name': '姓',
        'first_name': '名',
        'last_name_kana': '姓(カナ)',
        'first_name_kana': '名(カナ)',
        'tel': '電話番号',
        'email': 'メールアドレス',
        'password': 'パスワード'
      }
    },
    admin_edit : {
      rules : {
        'last_name': 'required|string|max:25',
        'first_name': 'required|string|max:25',
        'last_name_kana': 'required|string|max:25', // かな判定追加する 必須にしない
        'first_name_kana': 'required|string|max:25', // かな判定追加する 必須にしない
        'tel': 'required|string|max:15', // 日本のサービスなので日本語の電話番号かの判定ロジック必要
        'email': 'required|email|max:100'
      },
      attributes : { 
        'last_name': '姓',
        'first_name': '名',
        'last_name_kana': '姓(カナ)',
        'first_name_kana': '名(カナ)',
        'tel': '電話番号',
        'email': 'メールアドレス'
      }
    },
    user_create : {
      rules : {
        'last_name': 'required|string|max:25',
        'first_name': 'required|string|max:25',
        'last_name_kana': 'string|max:25',
        'first_name_kana': 'string|max:25',
        'gender': 'required|integer|min:0|max:3',
        'birthday': 'required|date',
        'post_code': 'required|string|max:10',
        'prefecture': 'required|string|max:50',
        'municipality': 'required|string|max:50',
        'street_name': 'required|string|max:50',
        'street_number': 'required|string|max:50',
        'building': 'string|max:50',
        'delivery_post_code': 'string|max:10',
        'delivery_prefecture': 'string|max:50',
        'delivery_municipality': 'string|max:50',
        'delivery_street_name': 'string|max:50',
        'delivery_street_number': 'string|max:50',
        'delivery_building': 'string|max:50',
        'tel': 'required|string|max:15',
        'email': 'required|email|max:100',
        'password': 'required|string|alpha_num|min:8|max:100',
        'is_received': 'required|integer|min:0|max:1'
      },
      attributes : { 
        'last_name': '姓',
        'first_name': '名',
        'last_name_kana': '姓(カナ)',
        'first_name_kana': '名(カナ)',
        'gender': '性別',
        'birthday': '生年月日',
        'post_code': '郵便番号',
        'prefecture': '都道府県',
        'municipality': '市区町村郡',
        'street_name': '町名',
        'street_number': '丁目番地',
        'building': '建物名',
        'delivery_post_code': '郵便番号(配送先)',
        'delivery_prefecture': '都道府県(配送先)',
        'delivery_municipality': '市区町村郡(配送先)',
        'delivery_street_name': '町名(配送先)',
        'delivery_street_number': '丁目番地(配送先)',
        'delivery_building': '建物名(配送先)',
        'tel': '電話番号',
        'email': 'メールアドレス',
        'password': 'パスワード',
        'is_received': 'DM登録'
      }
    },
    user_edit : {
      rules : {
        'last_name': 'required|string|max:25',
        'first_name': 'required|string|max:25',
        'last_name_kana': 'string|max:25',
        'first_name_kana': 'string|max:25',
        'gender': 'required|integer|min:0|max:3',
        'birthday': 'required|date',
        'post_code': 'required|string|max:10',
        'prefecture': 'required|string|max:50',
        'municipality': 'required|string|max:50',
        'street_name': 'required|string|max:50',
        'street_number': 'required|string|max:50',
        'building': 'string|max:50',
        'delivery_post_code': 'string|max:10',
        'delivery_prefecture': 'string|max:50',
        'delivery_municipality': 'string|max:50',
        'delivery_street_name': 'string|max:50',
        'delivery_street_number': 'string|max:50',
        'delivery_building': 'string|max:50',
        'tel': 'required|string|max:15',
        'email': 'required|email|max:100',
        'is_received': 'required|integer|min:0|max:1'
      },
      attributes : { 
        'last_name': '姓',
        'first_name': '名',
        'last_name_kana': '姓(カナ)',
        'first_name_kana': '名(カナ)',
        'gender': '性別',
        'birthday': '生年月日',
        'post_code': '郵便番号',
        'prefecture': '都道府県',
        'municipality': '市区町村郡',
        'street_name': '町名',
        'street_number': '丁目番地',
        'building': '建物名',
        'delivery_post_code': '郵便番号(配送先)',
        'delivery_prefecture': '都道府県(配送先)',
        'delivery_municipality': '市区町村郡(配送先)',
        'delivery_street_name': '町名(配送先)',
        'delivery_street_number': '丁目番地(配送先)',
        'delivery_building': '建物名(配送先)',
        'tel': '電話番号',
        'email': 'メールアドレス',
        'is_received': 'DM登録'
      }
    },
    notification_request : {
      rules : {
        'title': 'required|string|max:255',
        'body': 'required|string',
        'is_published': 'required|integer|min:0|max:1',
        'expired_at': 'date'
      },
      attributes : { 
        'title': 'タイトル',
        'body': '本文',
        'is_published': '公開設定',
        'expired_at': '掲載終了日'
      }
    },
    item_create : {
      rules : {
        'product_number': 'required|string|max:50',
        'item_name': 'required|string|max:100',
        'price': 'required|integer|min:0',
        'cost': 'required|integer|min:0',
        'made_in': 'required|string|max:80',
        'mixture_ratio': 'required|string|max:255',
        'description': 'required|string',
        'is_published': 'required|integer|min:0|max:1',
        'brand_id': 'required|integer',
        'gender_category': 'required|integer',
        'main_category': 'required|integer',
        'sub_category': 'required|integer',
        'tags_id.*': 'integer',
        'skus.*.size_id': 'required|integer',
        'skus.*.color_id': 'required|integer',
        'skus.*.quantity': 'integer|min:0',
        'images.*.color_id': 'required|integer',
        'images.*.image': 'required|string|max:255',
        'images.*.image_category': 'required|integer|min:0|max:1',
        'measurements.*.size_id': 'required|integer',
        'measurements.*.width': 'numeric|min:0',
        'measurements.*.shoulder_width': 'numeric|min:0',
        'measurements.*.raglan_sleeve_length': 'numeric|min:0',
        'measurements.*.sleeve_length': 'numeric|min:0',
        'measurements.*.length': 'numeric|min:0',
        'measurements.*.waist': 'numeric|min:0',
        'measurements.*.hip': 'numeric|min:0',
        'measurements.*.rise': 'numeric|min:0',
        'measurements.*.inseam': 'numeric|min:0',
        'measurements.*.thigh_width': 'numeric|min:0',
        'measurements.*.outseam': 'numeric|min:0',
        'measurements.*.sk_length': 'numeric|min:0',
        'measurements.*.hem_width': 'numeric|min:0',
        'measurements.*.weight': 'numeric|min:0'
      },
      attributes : { 
        'product_number': '品番',
        'item_name': '商品名',
        'price': '価格',
        'cost': '原価',
        'made_in': '生産国',
        'mixture_ratio': '混用率',
        'description': '商品説明',
        'is_published': '公開設定',
        'brand_id': 'ブランド',
        'gender_category': '性別カテゴリ',
        'main_category': 'メインカテゴリ',
        'sub_category': 'サブカテゴリ',
        'tags_id.*': 'タグ',
        'skus.*.size_id': 'サイズ',
        'skus.*.color_id': 'カラー',
        'skus.*.quantity': '在庫数',
        'images.*.color_id': '関連カラー',
        'images.*.image': '画像',
        'images.*.image_category': '画像種別',
        'measurements.*.size_id': 'サイズ',
        'measurements.*.width': '身幅',
        'measurements.*.shoulder_width': '肩幅',
        'measurements.*.raglan_sleeve_length': '裄丈',
        'measurements.*.sleeve_length': '袖丈',
        'measurements.*.length': '着丈',
        'measurements.*.waist': 'ウエスト',
        'measurements.*.hip': 'ヒップ',
        'measurements.*.rise': '股上',
        'measurements.*.inseam': '股下',
        'measurements.*.thigh_width': 'わたり',
        'measurements.*.outseam': 'パンツ総丈',
        'measurements.*.sk_length': 'スカート丈',
        'measurements.*.hem_width': '裾幅',
        'measurements.*.weight': '重量'
      }
    },
    item_edit : {
      rules : {
        'product_number': 'required|string|max:50',
        'item_name': 'required|string|max:100',
        'price': 'required|integer|min:0',
        'cost': 'required|integer|min:0',
        'made_in': 'required|string|max:80',
        'mixture_ratio': 'required|string|max:255',
        'description': 'required|string',
        'is_published': 'required|integer|min:0|max:1',
        'brand_id': 'required|integer',
        'gender_category': 'required|integer',
        'main_category': 'required|integer',
        'sub_category': 'required|integer',
        'tags_id.*': 'integer',
        'skus.*.id': 'integer',
        'skus.*.item_id': 'required|integer',
        'skus.*.size_id': 'required|integer',
        'skus.*.color_id': 'required|integer',
        'skus.*.quantity': 'integer|min:0',
        'images.*.id': 'integer',
        'images.*.item_id': 'required|integer',
        'images.*.color_id': 'required|integer',
        'images.*.image': 'required|string|max:255',
        'images.*.image_category': 'required|integer|min:0|max:1',
        'measurements.*.id': 'integer',
        'measurements.*.size_id': 'required|integer',
        'measurements.*.width': 'numeric|min:0',
        'measurements.*.shoulder_width': 'numeric|min:0',
        'measurements.*.raglan_sleeve_length': 'numeric|min:0',
        'measurements.*.sleeve_length': 'numeric|min:0',
        'measurements.*.length': 'numeric|min:0',
        'measurements.*.waist': 'numeric|min:0',
        'measurements.*.hip': 'numeric|min:0',
        'measurements.*.rise': 'numeric|min:0',
        'measurements.*.inseam': 'numeric|min:0',
        'measurements.*.thigh_width': 'numeric|min:0',
        'measurements.*.outseam': 'numeric|min:0',
        'measurements.*.sk_length': 'numeric|min:0',
        'measurements.*.hem_width': 'numeric|min:0',
        'measurements.*.weight': 'numeric|min:0'
      },
      attributes : { 
        'product_number': '品番',
        'item_name': '商品名',
        'price': '価格',
        'cost': '原価',
        'made_in': '生産国',
        'mixture_ratio': '混用率',
        'description': '商品説明',
        'is_published': '公開設定',
        'brand_id': 'ブランド',
        'gender_category': '性別カテゴリ',
        'main_category': 'メインカテゴリ',
        'sub_category': 'サブカテゴリ',
        'tags_id.*': 'タグ',
        'skus.*.id': 'SKU ID',
        'skus.*.item_id': '商品ID',
        'skus.*.size_id': 'サイズ',
        'skus.*.color_id': 'カラー',
        'skus.*.quantity': '在庫数',
        'images.*.id': '画像ID',
        'images.*.item_id': '商品ID',
        'images.*.color_id': '関連カラー',
        'images.*.image': '画像',
        'images.*.image_category': '画像種別',
        'measurements.*.id': '寸法ID',
        'measurements.*.size_id': 'サイズ',
        'measurements.*.width': '身幅',
        'measurements.*.shoulder_width': '肩幅',
        'measurements.*.raglan_sleeve_length': '裄丈',
        'measurements.*.sleeve_length': '袖丈',
        'measurements.*.length': '着丈',
        'measurements.*.waist': 'ウエスト',
        'measurements.*.hip': 'ヒップ',
        'measurements.*.rise': '股上',
        'measurements.*.inseam': '股下',
        'measurements.*.thigh_width': 'わたり',
        'measurements.*.outseam': 'パンツ総丈',
        'measurements.*.sk_length': 'スカート丈',
        'measurements.*.hem_width': '裾幅',
        'measurements.*.weight': '重量'
      }
    },
    blog_create : {
      rules : {
        'title': 'required|string|max:255',
        'body': 'required|string',
        'brand_id': 'required|integer',
        'category_id': 'required|integer',
        'items_id.*': 'integer',
        'tags_id.*': 'integer',
        'is_published': 'required|integer|min:0|max:1',
        'file': 'required',
        'thumbnail': 'string|max:255'
      },
      attributes : { 
        'title': 'タイトル',
        'body': '本文',
        'brand_id': 'ブランドカテゴリ',
        'category_id': '性別カテゴリ',
        'items_id.*': '関連品番',
        'tags_id.*': 'タグ',
        'is_published': '公開設定',
        'file': 'サムネイル画像',
        'thumbnail': 'サムネイル画像'
      }
    },
    blog_edit : {
      rules : {
        'title': 'required|string|max:255',
        'body': 'required|string',
        'brand_id': 'required|integer',
        'category_id': 'required|integer',
        'items_id.*': 'integer',
        'tags_id.*': 'integer',
        'is_published': 'required|integer|min:0|max:1',
        'thumbnail': 'required|string|max:255'
      },
      attributes : { 
        'title': 'タイトル',
        'body': '本文',
        'brand_id': 'ブランドカテゴリ',
        'category_id': '性別カテゴリ',
        'items_id.*': '関連品番',
        'tags_id.*': 'タグ',
        'is_published': '公開設定',
        'thumbnail': 'サムネイル画像'
      }
    },
    news_create : {
      rules : {
        'title': 'required|string|max:255',
        'body': 'required|string',
        'brand_id': 'required|integer',
        'category_id': 'required|integer',
        'tags_id.*': 'integer',
        'is_published': 'required|integer|min:0|max:1',
        'file': 'required',
        'thumbnail': 'string|max:255'
      },
      attributes : { 
        'title': 'タイトル',
        'body': '本文',
        'brand_id': 'ブランドカテゴリ',
        'category_id': '性別カテゴリ',
        'tags_id.*': 'タグ',
        'is_published': '公開設定',
        'file': 'サムネイル画像',
        'thumbnail': 'サムネイル画像'
      }
    },
    news_edit : {
      rules : {
        'title': 'required|string|max:255',
        'body': 'required|string',
        'brand_id': 'required|integer',
        'category_id': 'required|integer',
        'tags_id.*': 'integer',
        'is_published': 'required|integer|min:0|max:1',
        'thumbnail': 'required|string|max:255'
      },
      attributes : { 
        'title': 'タイトル',
        'body': '本文',
        'brand_id': 'ブランドカテゴリ',
        'category_id': '性別カテゴリ',
        'tags_id.*': 'タグ',
        'is_published': '公開設定',
        'thumbnail': 'サムネイル画像'
      }
    },
    order_edit : {
      rules : {
        'is_paid': 'required|integer|min:0|max:1',
        'is_shipped': 'required|integer|min:0|max:1',
        'delivery_date': 'required|date',
        'delivery_time': 'required|string|max:30' 
      },
      attributes : { 
        'is_paid': '入金状況',
        'is_shipped': '出荷状況',
        'delivery_date': '配達希望日', 
        'delivery_time': '配達希望時間帯'
      }
    },
    contact_request : {
      rules : {
        'response_status': 'required|integer|min:0|max:2',
        'memo': 'string'
      },
      attributes : { 
        'response_status': '対応状況',
        'memo': '備考記入欄'
      }
    },
    color_request : {
      rules : {
        'color_name': 'required|string|max:30'
      },
      attributes : { 
        'color_name': 'カラー名'
      }
    },
    brand_request : {
      rules : {
        'brand_name': 'required|string|max:255'
      },
      attributes : { 
        'brand_name': 'ブランド名'
      }
    },
    tag_request : {
      rules : {
        'tag_name': 'required|string|max:255'
      },
      attributes : { 
        'tag_name': 'タグ名'
      }
    },
    category_request : {
      rules : {
        'category_name': 'required|string|max:50'
      },
      attributes : { 
        'category_name': 'カテゴリー名'
      }
    },
    size_request : {
      rules : {
        'size_name': 'required|string|max:30'
      },
      attributes : { 
        'size_name': 'サイズ名'
      }
    }
    // ChangePasswordRequest
    // ResetPasswordRequest
  },
  user : {
    contact_request : {
      rules : {
        'last_name': 'required|string|max:25', 
        'first_name': 'required|string|max:25', 
        'last_name_kana': 'string|max:25',
        'first_name_kana': 'string|max:25',
        'tel': 'required|string|max:15', 
        'email': 'required|email|max:100', 
        'title': 'required|string|max:255', 
        'body': 'required|string'
      },
      attributes : { 
        'last_name': '姓', 
        'first_name': '名', 
        'last_name_kana': '姓(カナ)', 
        'first_name_kana': '名(カナ)', 
        'tel': '電話番号', 
        'email': 'メールアドレス', 
        'title': 'タイトル', 
        'body': '本文'
      }
    },
    order_request : {
      rules : {
        'total_amount': 'required|integer|min:0',
        'payment_method': 'required|integer|min:0|max:1',
        'delivery_date': 'required|date',
        'delivery_time': 'required|string|max:30'
      },
      attributes : { 
        'total_amount': '請求合計',
        'payment_method': '支払い方法',
        'delivery_date': 'ご希望配達日',
        'delivery_time': 'ご希望配達時間帯'
      }
    },
    user_create : {
      rules : {
        'last_name': 'required|string|max:25',
        'first_name': 'required|string|max:25',
        'last_name_kana': 'string|max:25',
        'first_name_kana': 'string|max:25',
        'gender': 'required|integer|min:0|max:3',
        'birthday': 'required|date',
        'post_code': 'required|string|max:10',
        'prefecture': 'required|string|max:50',
        'municipality': 'required|string|max:50',
        'street_name': 'required|string|max:50',
        'street_number': 'required|string|max:50',
        'building': 'string|max:50',
        'delivery_post_code': 'string|max:10',
        'delivery_prefecture': 'string|max:50',
        'delivery_municipality': 'string|max:50',
        'delivery_street_name': 'string|max:50',
        'delivery_street_number': 'string|max:50',
        'delivery_building': 'string|max:50',
        'tel': 'required|string|max:15',
        'email': 'required|email|max:100',
        'password': 'required|string|alpha_num|min:8|max:100',
        'is_received': 'required|integer|min:0|max:1'
      },
      attributes : { 
        'last_name': '姓',
        'first_name': '名',
        'last_name_kana': '姓(カナ)',
        'first_name_kana': '名(カナ)',
        'gender': '性別',
        'birthday': '生年月日',
        'post_code': '郵便番号',
        'prefecture': '都道府県',
        'municipality': '市区町村郡',
        'street_name': '町名',
        'street_number': '丁目番地',
        'building': '建物名',
        'delivery_post_code': '郵便番号(配送先)',
        'delivery_prefecture': '都道府県(配送先)',
        'delivery_municipality': '市区町村郡(配送先)',
        'delivery_street_name': '町名(配送先)',
        'delivery_street_number': '丁目番地(配送先)',
        'delivery_building': '建物名(配送先)',
        'tel': '電話番号',
        'email': 'メールアドレス',
        'password': 'パスワード',
        'is_received': 'DM登録'
      }
    },
    user_edit : {
      rules : {
        'last_name': 'required|string|max:25',
        'first_name': 'required|string|max:25',
        'last_name_kana': 'string|max:25',
        'first_name_kana': 'string|max:25',
        'gender': 'required|integer|min:0|max:3',
        'birthday': 'required|date',
        'post_code': 'required|string|max:10',
        'prefecture': 'required|string|max:50',
        'municipality': 'required|string|max:50',
        'street_name': 'required|string|max:50',
        'street_number': 'required|string|max:50',
        'building': 'string|max:50',
        'delivery_post_code': 'string|max:10',
        'delivery_prefecture': 'string|max:50',
        'delivery_municipality': 'string|max:50',
        'delivery_street_name': 'string|max:50',
        'delivery_street_number': 'string|max:50',
        'delivery_building': 'string|max:50',
        'tel': 'required|string|max:15',
        'email': 'required|email|max:100',
        'is_received': 'required|integer|min:0|max:1'
      },
      attributes : { 
        'last_name': '姓',
        'first_name': '名',
        'last_name_kana': '姓(カナ)',
        'first_name_kana': '名(カナ)',
        'gender': '性別',
        'birthday': '生年月日',
        'post_code': '郵便番号',
        'prefecture': '都道府県',
        'municipality': '市区町村郡',
        'street_name': '町名',
        'street_number': '丁目番地',
        'building': '建物名',
        'delivery_post_code': '郵便番号(配送先)',
        'delivery_prefecture': '都道府県(配送先)',
        'delivery_municipality': '市区町村郡(配送先)',
        'delivery_street_name': '町名(配送先)',
        'delivery_street_number': '丁目番地(配送先)',
        'delivery_building': '建物名(配送先)',
        'tel': '電話番号',
        'email': 'メールアドレス',
        'is_received': 'DM登録'
      }
    }
    // ChangePasswordRequest
    // ResetPasswordRequest
  }
}



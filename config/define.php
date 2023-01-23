<?php

    return [
        // DB const
        'gender' => [ 0 => '男性', 1 => '女性', 2 => 'その他', 3 => '未回答'],
        'is_received' => [ 0 => '未登録', 1 => '登録済'],
        'response_status' => [ 0 => '未対応', 1 => '対応中', 2 => '対応済'],
        'is_published' => [ 0 => '非公開', 1 => '公開中'],
        'is_published_r' => [ 'close' => 0, 'open' => 1],
        'image_category' => [ 0 => 'メイン画像', 1 => 'サムネイル画像'],
        'image_category_r' => [ 'main' => 0, 'thumbnail' => 1],
        'payment_method' => [ 0 => 'クレジットカード', 1 => '代引き'],
        'payment_status' => [ 0 => '未決済', 1 => '決済済'],
        'payment_status_r' => [ 'faile' => 0, 'success' => 1],
        'is_paid' => [ 0 => '未入金', 1 => '入金済'],
        'is_paid_r' => [ 'not_paid' => 0, 'paid' => 1],
        'is_shipped' => [ 0 => '未配送', 1 => '配送済'],
        'is_shipped_r' => [ 'not_shipped' => 0, 'shipped' => 1],
        'category_id' => [ 1 => 'メンズ', 2 => 'レディース'],
        // Mail
        'user_email' => [
            'from' => [
                "address" => "no-reply@example.com",  // メール送信元アドレス
                "name" => "【運営会社】XXXXカンパニー",   // メール送信元名
            ],
        ],
        'admin_email' => [
            'from' => [
                "address" => "test@example.com",  // メール送信元アドレス
                "name" => "【通知】XXXXアプリ",   // メール送信元名
            ],
            'to' => [
                "sales_report" => "sales_report@example.com",  // 運営会社メールアドレス【注文連絡】
                "support" => "support@example.com",  // 運営会社メールアドレス【サポート先】
            ],
        ],
        // stripe決済手数料
        'stripe_commision_fee' => 0.036,
    ];


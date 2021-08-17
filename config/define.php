<?php

    return [
        // users
        'gender' => [ 0 => '男性', 1 => '女性', 2 => 'その他', 3 => '未回答'],
        'is_received' => [ 0 => '未登録', 1 => '登録済'],
        // contacts
        'response_status' => [ 0 => '未対応', 1 => '対応中', 2 => '対応済'],
        // notifications, news, blogs, items
        'is_published' => [ 0 => '未公開', 1 => '公開中'],
        // images
        'image_category' => [ 0 => 'メイン画像', 1 => 'サムネイル画像'],
        // orders
        'payment_method' => [ 0 => 'クレジットカード', 1 => '代引き'],
        'payment_status' => [ 0 => '決済済', 1 => '3D認証決済前'],
        'is_paid' => [ 0 => '未入金', 1 => '入金済'],
        'is_shipped' => [ 0 => '未配送', 1 => '配送済'],
    ];


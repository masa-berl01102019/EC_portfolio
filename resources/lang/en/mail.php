<?php

return [
    'admin' => [
        'from' => [
            "name" => "【Notification】XXXX APP",   // メール送信元名
        ],
        'change_password' => [
            'subject' => 'Your password has been changed',
            "honorific" => "Dear Sir/Madam :name",
            "p1" => "Inform you that we have accepted your request to change your password.",
            "p2" => "Please reset your password to protect your acount if you did not make this change.",
            "p3" => "Please click below link if you would like to reset your password.",
            "p4" => "【Password reset page】",
            "p5" => "Click here"
        ],
        'contact' => [
            'subject' => 'We received user contact',
            "support_team" => "Customer support team",
            "p1" => "Inform you that we received user contact as the following details.",
            "created_at" => "【Contact Date】",
            "user_name" => "【Customer Name】",
            "email" => "【Customer Email】",
            "subject2" => "【Subject】",
            "message" => "【Message】"
        ],
        'order' => [
            'subject' => 'We received an order',
            "support_team" => "Order support team",
            "p1" => "Inform you that you received order as the following details.",
            "p2" => "(The total amount includes tax.)",
            "order_id" => "【Order number】",
            "full_name" => "【Customer name】",
            "created_at" => "【Order date】",
            "total_amount" => "【Total amount】",
            "tax_amount" => "(Tax ¥:tax)",
            "payment_method" => "【Payment method】",
            "credit_card" => "Credit card",
            "order_items" => "【Order details】",
            "product_number" => "Product number",
            "item_name" => "Product name",
            "order_size" => "Size",
            "order_color" => "Color",
            "order_quantity" => "quantity",
            "order_price" => "price",
            "tax_excluded" => "(Tax excluded)"
        ],
        'reset_password' => [
            'subject' => 'Reset your password',
            "honorific" => "Dear Sir/Madam :name",
            "p1" => "Inform you that we have accepted request to reset your password.",
            "p2" => "Please click below link if you would like to change your password.",
            "p3" => "【Password reset link】",
            "p4" => "Click here",
            "p5" => "【Expiration date of password reset】",
            "p6" => "Please ignore this mail if you have not requested to reset your password.",
            "p7" => "You cannot change your password unless you click above link and create new password.",
            "p8" => "There is expiration date at above URL.",
            "p9" => "You cannot access above link if it is over expiration date.",
            "p10" => "We appreciate your understanding in advance."
        ]
    ],
    'user' => [
        'from' => [
            "name" => "【Operating company】XXXX company",   // メール送信元名
        ],
        'change_password' => [
            'subject' => 'Your password has been changed',
            "p1" => "Inform you that we have accepted your request to change your password.",
            "p2" => "Please reset your password to protect your acount if you did not make this change.",
            "p3" => "Please click below link if you would like to reset your password.",
            "p4" => "【Password reset page】",
            "p5" => "Click here"
        ],
        'contact' => [
            'subject' => 'Thank you for contact us',
            "p1" => "We accepted your contact as the following details.",
            "created_at" => "【Contact Date】",
            "subject2" => "【Subject】",
            "message" => "【Message】",
            "notice1" => "Our support staff will reply to you about your contact.",
            "notice2" => "We are afraid that it might take a few days to reply it.",
            "notice3" => "We appreciate your understanding in advance."
        ],
        'order' => [
            'subject' => 'Complete of your order and payment',
            "p1" => "We have received your order and confirmed your payment as the following details.",
            "p2" => "(The total amount includes tax.)",
            "order_id" => "【Order number】",
            "full_name" => "【Customer name】",
            "created_at" => "【Order date】",
            "total_amount" => "【Total amount】",
            "tax_amount" => "(Tax ¥:tax)",
            "payment_method" => "【Payment method】",
            "credit_card" => "Credit card",
            "order_items" => "【Order details】",
            "product_number" => "Product number",
            "item_name" => "Product name",
            "order_size" => "Size",
            "order_color" => "Color",
            "order_quantity" => "quantity",
            "order_price" => "price",
            "tax_excluded" => "(Tax excluded)",
            "notice1" => "※Our products you ordered will be shipped after your payment is confirmed.",
            "notice2" => "We are afraid that orders cannot be canceled through our website.",
            "notice3" => "Please contact the operating company below directly."
        ],
        'reset_password' => [
            'subject' => 'Reset your password',
            "p1" => "Inform you that we have accepted request to reset your password.",
            "p2" => "Please click below link if you would like to change your password.",
            "p3" => "【Password reset link】",
            "p4" => "Click here",
            "p5" => "【Expiration date of password reset】",
            "p6" => "Please ignore this mail if you have not requested to reset your password.",
            "p7" => "You cannot change your password unless you click above link and create new password.",
            "p8" => "There is expiration date at above URL.",
            "p9" => "You cannot access above link if it is over expiration date.",
            "p10" => "We appreciate your understanding in advance."
        ],
        'common' => [
            "honorific" => "Dear Sir/Madam :name",
            "thanks_greeting" => "Thank you for using our service.",
            "noreply_notice1" => "※This email is sent automatically.",
            "noreply_notice2" => "We do not respond If you reply to this email.",
            "noreply_notice3" => "Please contact the operating company below if you have any question.",
            "contact" => "【Contact info】",
            "company" => "OPERATING COMPANY",
            "company_ex" => "XXXX company",
            "address" => "ADDRESS",
            "address_ex" => "XXXX BLDG 1F, 2-3-4, XXXX, XXXX City XXXX-Ku, XXXX Prefecture, 123-4567, Japan"
        ]
    ]
];

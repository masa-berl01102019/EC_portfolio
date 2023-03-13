<?php

return [
    // DB const 
    'is_published' => ['close' => 0, 'open' => 1],
    'gender_category' => ['men' => 1, 'women' => 2],
    'image_category' => ['main' => 0, 'thumbnail' => 1],
    'payment_status' => ['faile' => 0, 'success' => 1],
    'is_paid' => ['not_paid' => 0, 'paid' => 1],
    'is_shipped' => ['not_shipped' => 0, 'shipped' => 1],
    'category_type' => ['gender' => 1, 'main' => 2, 'sub' => 3],
    'stock_status' => ['in_stock' => 1, 'sold_out' => 0],
    'cart_status' => ['out_of_cart' => 0, 'in_cart' => 1],
    'delete_status' => ['not_deleted' => 0, 'deleted' => 1],
    'gender' => ['man' => 0, 'woman' => 1, 'others' => 2, 'no_answer' => 3],
    'response_status' => ['yet' => 0, 'during' => 1, 'done' => 2],
    'is_received' => ['not_registered' => 0, 'registered' => 1],
    // Mail
    'user_email' => [
        'from' => [
            "address" => "no-reply@example.com",
        ],
    ],
    'admin_email' => [
        'from' => [
            "address" => "test@example.com",
        ],
        'to' => [
            "sales_report" => "sales_report@example.com",  // Operation company Email address 【For order】
            "support" => "support@example.com",  // Operation company Email address 【For contact】
        ],
    ],
    'main_category' => [
        36504 => 3, 36583 => 4, 36571 => 5, 36624 => 6, 48271 => 7, 36861 => 8, 37052 => 9, 37019 => 10, 36913 => 11, 36903 => 12, 36887 => 13
    ],
    'sub_category' => [
        // men's tops
        36505 => 14, 48269 => 15, 36532 => 16, 36535 => 17, 36541 => 18, 36554 => 19, 36559 => 20, 36540 => 21, 36550 => 22, 36531 => 23, 36530 => 23,
        // men's tops children
        36507 => 14, 36508 => 14, 36509 => 14,
        36536 => 17, 36537 => 17, 36538 => 17,
        36551 => 22, 36552 => 22, 48270 => 22,
        // men's jakect
        36584 => 24, 48262 => 25, 36587 => 26, 36589 => 27, 36596 => 28, 36588 => 29, 36590 => 30, 36609 => 31, 36608 => 32, 48263 => 32, 36597 => 33, 36592 => 34, 36593 => 35, 48264 => 36, 36601 => 36, 36697 => 36,  36599 => 36, 36595 => 36, 36598 => 36,
        // men's coat
        36579 => 37, 36591 => 38, 36575 => 39, 36572 => 40, 36574 => 41, 36573 => 42, 36582 => 43, 36580 => 44, 36578 => 45, 36577 => 45, 36581 => 45, 48259 => 45,
        // men's pants
        36625 => 46, 36645 => 47, 36650 => 48, 36638 => 49, 36652 => 50, 36655 => 51, 48288 => 52, 36653 => 53, 36651 => 54, 36639 => 55, 36658 => 56, 36659 => 57, 36644 => 57, 36656 => 57,
        // men's all-in-one

        // ladies tops
        36997 => 59, 36938 => 60, 36912 => 61, 36862 => 62, 36929 => 63, 36989 => 64, 36975 => 65, 36926 => 66, 36906 => 67, 36914 => 68, 36999 => 69, 36909 => 70, 36928 => 71,
        // ladies tops children
        36864 => 62, 36865 => 62, 36866 => 62,
        36992 => 64, 36991 => 64, 36990 => 64,
        36977 => 65, 36978 => 65, 36976 => 65, 36979 => 65,
        36995 => 66, 36994 => 66, 36927 => 66, 36996 => 66,
        37001 => 69, 37005 => 69,
        36910 => 70, 36911 => 70,
        // ladies jakect
        37060 => 72, 37061 => 73, 37064 => 74, 37063 => 75, 37066 => 76, 48222 => 77, 48221 => 78, 37056 => 78, 48220 => 79, 48223 => 80, 48224 => 80, 37068 => 81, 37070 => 82, 37067 => 83, 37058 => 84, 37057 => 84, 37065 => 84, 37062 => 84,
        // ladies coat
        37028 => 85, 37032 => 86, 37023 => 87, 37020 => 88, 37025 => 89, 37021 => 90, 48218 => 91, 37029 => 92, 37022 => 93, 37039 => 94, 37031 => 94, 48249 => 94, 37038 => 94, 37030 => 94, 48219 => 94,
        // ladies pants
        36919 => 95, 37097 => 96, 37083 => 97, 36922 => 98, 37099 => 99, 37084 => 100, 37094 => 101, 37091 => 102, 37085 => 103, 37093 => 104, 37073 => 105, 37072 => 106, 37101 => 107, 37077 => 108, 37098 => 108,
        // ladies pants children
        37074 => 105, 37075 => 105, 37076 => 105,
        // ladies all-in-one
        37156 => 109, 48228 => 109,
        // ladies one piece
        37013 => 110, 36893 => 111
    ],
    // stripe commision fee
    'stripe_commision_fee' => 0.036,
    // API status
    'api_status' => ['success' => 1, 'error' => 9],
];

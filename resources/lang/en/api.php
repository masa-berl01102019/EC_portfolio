<?php

return [
    'admin' => [
        'admins' => [
            'get_err' => 'Failed to get admin info.',
            'create_msg' => 'Successfully registered admin info.',
            'create_err' => 'Failed to register admin info.',
            'update_msg' => 'Successfully edited admin info.',
            'update_err' => 'Failed to edited admin info.',
            'delete_msg' => 'Successfully deleted admin info.',
            'delete_err' => 'Failed to delete admin info.',
            'csv_header' => ['No', 'ID', 'Name (Kana)', 'Tel', 'Email', 'Created date', 'Updated date'],
            'csv_file_name' => 'AdminInfo.csv',
            'csv_err' => 'Failed to output csv file.'
        ],
        'auth' => [
            'login_msg' => 'Successfully logged in.',
            'login_err' => 'Failed to logged in.',
            'logout_msg' => 'Successfully logged out.',
            'logout_err' => 'Failed to logged out.'
        ],
        'blogs' => [
            'get_err' => 'Failed to get blog info.',
            'create_msg' => 'Successfully registered blog info.',
            'create_err' => 'Failed to register blog info.',
            'update_msg' => 'Successfully edited blog info.',
            'update_err' => 'Failed to edited blog info.',
            'delete_msg' => 'Successfully deleted blog info.',
            'delete_err' => 'Failed to delete blog info.',
            'csv_header' => ['No', 'ID', 'Published status', 'Title', 'Brand', 'Category', 'Related product number', 'Related tag', 'Last updated by', 'Posted date', 'Updated date'],
            'csv_file_name' => 'BlogInfo.csv',
            'csv_err' => 'Failed to output csv file.'
        ],
        'brands' => [
            'get_err' => 'Failed to get brand info.',
            'create_msg' => 'Successfully registered brand info.',
            'create_err' => 'Failed to register brand info.',
            'update_msg' => 'Successfully edited brand info.',
            'update_err' => 'Failed to edited brand info.',
            'delete_msg' => 'Successfully deleted brand info.',
            'delete_err' => 'Failed to delete brand info.',
            'delete_err2' => 'Selected brand has been already used at item or blog or news.'
        ],
        'categories' => [
            'get_err' => 'Failed to get category info.',
            'create_msg' => 'Successfully registered category info.',
            'create_err' => 'Failed to register category info.',
            'update_msg' => 'Successfully edited category info.',
            'update_err' => 'Failed to edited category info.',
            'delete_msg' => 'Successfully deleted category info.',
            'delete_err' => 'Failed to delete category info.',
            'delete_err2' => 'Selected category has been already used at item or blog or news.',
            'delete_err3' => 'Need to delete child category which is related selected category at first.'
        ],
        'colors' => [
            'get_err' => 'Failed to get color info.',
            'create_msg' => 'Successfully registered color info.',
            'create_err' => 'Failed to register color info.',
            'update_msg' => 'Successfully edited color info.',
            'update_err' => 'Failed to edited color info.',
            'delete_msg' => 'Successfully deleted color info.',
            'delete_err' => 'Failed to delete color info.',
            'delete_err2' => 'Selected color has been already used at item.'
        ],
        'contacts' => [
            'get_err' => 'Failed to get contact info.',
            'update_msg' => 'Successfully edited contact info.',
            'update_err' => 'Failed to edited contact info.',
            'delete_msg' => 'Successfully deleted contact info.',
            'delete_err' => 'Failed to delete contact info.',
            'csv_header' => ['No', 'ID', 'User ID', 'Name', 'Name (Kana)', 'Tel', 'Email', 'Contacted date', 'Subject', 'Message', 'Response status', 'Admin name', 'Memo', 'Updated date'],
            'csv_file_name' => 'ContactInfo.csv',
            'csv_err' => 'Failed to output csv file.'
        ],
        'items' => [
            'get_err' => 'Failed to get item info.',
            'create_msg' => 'Successfully registered item info.',
            'create_err' => 'Failed to register item info.',
            'update_msg' => 'Successfully edited item info.',
            'update_err' => 'Failed to edited item info.',
            'delete_msg' => 'Successfully deleted item info.',
            'delete_err' => 'Failed to delete item info.',
            'delete_size_msg' => 'Successfully deleted size info.',
            'delete_size_err' => 'Failed to delete size info.',
            'delete_sku_msg' => 'Successfully deleted sku info.',
            'delete_sku_err' => 'Failed to delete sku info.',
            'delete_img_msg' => 'Successfully deleted image info.',
            'delete_img_err' => 'Failed to delete image info.',
            'csv_header' => ['No', 'ID', 'Published status', 'Product number', 'Product name', 'Price', 'Cost', 'Color variation', 'Size variation', 'Country of origin', 'Mixture ratio', 'Brand Category', 'Gender category', 'Main category', 'Sub category', 'Related tag', 'Last updated by', 'Posted date', 'Updated date'],
            'csv_file_name' => 'ItemInfo.csv',
            'csv_err' => 'Failed to output csv file.'
        ],
        'news' => [
            'get_err' => 'Failed to get news info.',
            'create_msg' => 'Successfully registered news info.',
            'create_err' => 'Failed to register news info.',
            'update_msg' => 'Successfully edited news info.',
            'update_err' => 'Failed to edited news info.',
            'delete_msg' => 'Successfully deleted news info.',
            'delete_err' => 'Failed to delete news info.',
            'csv_header' => ['No', 'ID', 'Published status', 'Title', 'Brand', 'Category', 'Related tag', 'Last updated by', 'Posted date', 'Updated date'],
            'csv_file_name' => 'NewsInfo.csv',
            'csv_err' => 'Failed to output csv file.'
        ],
        'notifications' => [
            'get_err' => 'Failed to get notification info.',
            'create_msg' => 'Successfully registered notification info.',
            'create_err' => 'Failed to register notification info.',
            'update_msg' => 'Successfully edited notification info.',
            'update_err' => 'Failed to edited notification info.',
            'delete_msg' => 'Successfully deleted notification info.',
            'delete_err' => 'Failed to delete notification info.',
            'csv_header' => ['No', 'ID', 'Published status', 'Title', 'Body', 'Last updated by', 'Expired date', 'Posted date', 'Updated date'],
            'csv_file_name' => 'NotificationInfo.csv',
            'csv_err' => 'Failed to output csv file.'
        ],
        'orders' => [
            'get_err' => 'Failed to get order info.',
            'update_msg' => 'Successfully edited order info.',
            'update_err' => 'Failed to edited order info.',
            'delete_msg' => 'Successfully deleted order info.',
            'delete_err' => 'Failed to delete order info.',
            'csv_header' => ['No', 'ID', 'Purchase date', 'Purchase amount', 'Payment method', 'Payment token', 'Preferred delivery day', 'Preferred delivery time', 'Payment status', 'Delivery status', 'Name', 'Tel', 'Email', 'Delivery postcode', 'Delivery address', 'Updated date'],
            'csv_file_name' => 'OrderInfo.csv',
            'csv_err' => 'Failed to output csv file.'
        ],
        'reset_passwords' => [
            'send_msg' => 'Sent reset password mail.',
            'send_err' => 'User doesn\'t exist.',
            'send_err2' => 'Failed to send reset password mail.',
            'change_msg' => 'Successfully changed password.',
            'change_err' => 'Record doesn\'t exist.',
            'change_err2' => 'This url has been expired.',
            'change_err3' => 'User doesn\'t exist.',
            'change_err4' => 'Failed to change password'
        ],
        'sizes' => [
            'get_err' => 'Failed to get size info.',
            'create_msg' => 'Successfully registered size info.',
            'create_err' => 'Failed to register size info.',
            'update_msg' => 'Successfully edited size info.',
            'update_err' => 'Failed to edited size info.',
            'delete_msg' => 'Successfully deleted size info.',
            'delete_err' => 'Failed to delete size info.',
            'delete_err2' => 'Selected size has been already used at item.'
        ],
        'tags' => [
            'get_err' => 'Failed to get tag info.',
            'create_msg' => 'Successfully registered tag info.',
            'create_err' => 'Failed to register tag info.',
            'update_msg' => 'Successfully edited tag info.',
            'update_err' => 'Failed to edited tag info.',
            'delete_msg' => 'Successfully deleted tag info.',
            'delete_err' => 'Failed to delete tag info.',
            'delete_err2' => 'Selected tag has been already used at item or blog or news.'
        ],
        'users' => [
            'get_err' => 'Failed to get user info.',
            'create_msg' => 'Successfully registered user info.',
            'create_err' => 'Failed to register user info.',
            'update_msg' => 'Successfully edited user info.',
            'update_err' => 'Failed to edited user info.',
            'delete_msg' => 'Successfully deleted user info.',
            'delete_err' => 'Failed to delete user info.',
            'csv_header' => ['No', 'ID', 'Name', 'Name (Kana)', 'Gender', 'Birthday', 'Postcode', 'Address', 'Delivery-Postcode', 'Delivery-Address', 'Tel', 'Email', 'DM', 'Created date', 'Updated date'],
            'csv_file_name' => 'UserInfo.csv',
            'csv_err' => 'Failed to output csv file.'
        ]
    ],
    'user' => [
        'auth' => [
            'login_msg' => 'Successfully logged in.',
            'login_err' => 'Failed to logged in.',
            'logout_msg' => 'Successfully logged out.',
            'logout_err' => 'Failed to logged out.'
        ],
        'blogs' => [
            'get_err' => 'Failed to get blog info.'
        ],
        'bookmarks' => [
            'get_err' => 'Failed to get bookmark info.',
            'create_msg' => 'Successfully registered bookmark info.',
            'create_err' => 'Failed to register bookmark info.',
            'delete_msg' => 'Successfully deleted bookmark info.',
            'delete_err' => 'Failed to delete bookmark info.'
        ],
        'carts' => [
            'get_err' => 'Failed to get cart info.',
            'create_msg' => 'Successfully registered cart info.',
            'create_err' => 'Failed to register cart info.',
            'update_msg' => 'Successfully edited cart info.',
            'update_err' => 'Failed to edited cart info.',
            'delete_msg' => 'Successfully deleted cart info.',
            'delete_err' => 'Failed to delete cart info.'
        ],
        'contacts' => [
            'create_msg' => 'Successfully registered contact info.',
            'create_err' => 'Failed to register contact info.'
        ],
        'top' => [
            'get_err' => 'Failed to get top page info.'
        ],
        'items' => [
            'get_err' => 'Failed to get item.',
            'get_err2' => 'Couldn\'t find item you were looking for.  It might be not public or deleted.',
            'get_err3' => 'Failed to get ranking item.',
            'get_err4' => 'Failed to get recommended item.',
            'get_err5' => 'Failed to get new item.',
            'get_err6' => 'Failed to get option.'
        ],
        'news' => [
            'get_err' => 'Failed to get news info.'
        ],
        'notifications' => [
            'get_err' => 'Failed to get notification info.'
        ],
        'orders' => [
            'get_err' => 'Failed to get cart info.',
            'create_msg' => 'Successfully made a payment.',
            'create_err' => 'Order quantity is over stocks',
            'create_err2' => 'Didn\'t match item price.',
            'create_err3' => 'Failed to make a payment.',
        ],
        'reset_passwords' => [
            'send_msg' => 'Sent reset password mail.',
            'send_err' => 'User doesn\'t exist.',
            'send_err2' => 'Failed to send reset password mail.',
            'change_msg' => 'Successfully changed password.',
            'change_err' => 'Record doesn\'t exist.',
            'change_err2' => 'This url has been expired.',
            'change_err3' => 'User doesn\'t exist.',
            'change_err4' => 'Failed to change password'
        ],
        'users' => [
            'get_err' => 'Failed to get user info.',
            'create_msg' => 'Successfully registered user info.',
            'create_err' => 'Failed to register user info.',
            'update_msg' => 'Successfully edited user info.',
            'update_err' => 'Failed to edited user info.',
            'delete_msg' => 'Successfully deleted user info.',
            'delete_err' => 'Failed to delete user info.'
        ]
    ],
    'error' => [
        '401' => 'Unauthorized',
        '404' => 'Not Found',
        '405' => 'Method Not Allowed',
        '408' => 'Request Timeout',
        '414' => 'URI Too Long',
        '415' => 'Unsupported Media Type',
        '429' => 'Too Many Requests',
        '400' => 'Bad Request',
        '503' => 'Service Unavailable',
        '500' => 'Internal Server Error'
    ],
    'const' => [
        'gender' => [0 => 'Male', 1 => 'Female', 2 => 'Others', 3 => 'No answer'],
        'is_received' => [0 => 'Non-registered', 1 => 'registered'],
        'response_status' => [0 => 'Yet', 1 => 'During', 2 => 'Done'],
        'is_published' => [0 => 'Unpublished', 1 => 'Published'],
        'payment_method' => [0 => 'Credit card', 1 => 'Cache'],
        'is_paid' => [0 => 'Not paid', 1 => 'Paid'],
        'is_shipped' => [0 => 'Not delivered', 1 => 'Delivered'],
        'category_id' => [1 => 'Men', 2 => 'Women']
    ]
];

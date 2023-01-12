<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | The following language lines contain the default error messages used by
    | the validator class. Some of these rules have multiple versions such
    | as the size rules. Feel free to tweak each of these messages here.
    |
    */

    'accepted' => 'The :attribute must be accepted.',
    'active_url' => 'The :attribute is not a valid URL.',
    'after' => 'The :attribute must be a date after :date.',
    'after_or_equal' => 'The :attribute must be a date after or equal to :date.',
    'alpha' => 'The :attribute may only contain letters.',
    'alpha_dash' => 'The :attribute may only contain letters, numbers, dashes and underscores.',
    'alpha_num' => 'The :attribute may only contain letters and numbers.',
    'array' => 'The :attribute must be an array.',
    'before' => 'The :attribute must be a date before :date.',
    'before_or_equal' => 'The :attribute must be a date before or equal to :date.',
    'between' => [
        'numeric' => 'The :attribute must be between :min and :max.',
        'file' => 'The :attribute must be between :min and :max kilobytes.',
        'string' => 'The :attribute must be between :min and :max characters.',
        'array' => 'The :attribute must have between :min and :max items.',
    ],
    'boolean' => 'The :attribute field must be true or false.',
    'confirmed' => 'The :attribute confirmation does not match.',
    'date' => 'The :attribute is not a valid date.',
    'date_equals' => 'The :attribute must be a date equal to :date.',
    'date_format' => 'The :attribute does not match the format :format.',
    'different' => 'The :attribute and :other must be different.',
    'digits' => 'The :attribute must be :digits digits.',
    'digits_between' => 'The :attribute must be between :min and :max digits.',
    'dimensions' => 'The :attribute has invalid image dimensions.',
    'distinct' => 'The :attribute field has a duplicate value.',
    'email' => 'The :attribute must be a valid email address.',
    'ends_with' => 'The :attribute must end with one of the following: :values',
    'exists' => 'The selected :attribute is invalid.',
    'file' => 'The :attribute must be a file.',
    'filled' => 'The :attribute field must have a value.',
    'gt' => [
        'numeric' => 'The :attribute must be greater than :value.',
        'file' => 'The :attribute must be greater than :value kilobytes.',
        'string' => 'The :attribute must be greater than :value characters.',
        'array' => 'The :attribute must have more than :value items.',
    ],
    'gte' => [
        'numeric' => 'The :attribute must be greater than or equal :value.',
        'file' => 'The :attribute must be greater than or equal :value kilobytes.',
        'string' => 'The :attribute must be greater than or equal :value characters.',
        'array' => 'The :attribute must have :value items or more.',
    ],
    'image' => 'The :attribute must be an image.',
    'in' => 'The selected :attribute is invalid.',
    'in_array' => 'The :attribute field does not exist in :other.',
    'integer' => 'The :attribute must be an integer.',
    'ip' => 'The :attribute must be a valid IP address.',
    'ipv4' => 'The :attribute must be a valid IPv4 address.',
    'ipv6' => 'The :attribute must be a valid IPv6 address.',
    'json' => 'The :attribute must be a valid JSON string.',
    'lt' => [
        'numeric' => 'The :attribute must be less than :value.',
        'file' => 'The :attribute must be less than :value kilobytes.',
        'string' => 'The :attribute must be less than :value characters.',
        'array' => 'The :attribute must have less than :value items.',
    ],
    'lte' => [
        'numeric' => 'The :attribute must be less than or equal :value.',
        'file' => 'The :attribute must be less than or equal :value kilobytes.',
        'string' => 'The :attribute must be less than or equal :value characters.',
        'array' => 'The :attribute must not have more than :value items.',
    ],
    'max' => [
        'numeric' => 'The :attribute may not be greater than :max.',
        'file' => 'The :attribute may not be greater than :max kilobytes.',
        'string' => 'The :attribute may not be greater than :max characters.',
        'array' => 'The :attribute may not have more than :max items.',
    ],
    'mimes' => 'The :attribute must be a file of type: :values.',
    'mimetypes' => 'The :attribute must be a file of type: :values.',
    'min' => [
        'numeric' => 'The :attribute must be at least :min.',
        'file' => 'The :attribute must be at least :min kilobytes.',
        'string' => 'The :attribute must be at least :min characters.',
        'array' => 'The :attribute must have at least :min items.',
    ],
    'not_in' => 'The selected :attribute is invalid.',
    'not_regex' => 'The :attribute format is invalid.',
    'numeric' => 'The :attribute must be a number.',
    'present' => 'The :attribute field must be present.',
    'regex' => 'The :attribute format is invalid.',
    'required' => 'The :attribute field is required.',
    'required_if' => 'The :attribute field is required when :other is :value.',
    'required_unless' => 'The :attribute field is required unless :other is in :values.',
    'required_with' => 'The :attribute field is required when :values is present.',
    'required_with_all' => 'The :attribute field is required when :values are present.',
    'required_without' => 'The :attribute field is required when :values is not present.',
    'required_without_all' => 'The :attribute field is required when none of :values are present.',
    'same' => 'The :attribute and :other must match.',
    'size' => [
        'numeric' => 'The :attribute must be :size.',
        'file' => 'The :attribute must be :size kilobytes.',
        'string' => 'The :attribute must be :size characters.',
        'array' => 'The :attribute must contain :size items.',
    ],
    'starts_with' => 'The :attribute must start with one of the following: :values',
    'string' => 'The :attribute must be a string.',
    'timezone' => 'The :attribute must be a valid zone.',
    'unique' => 'The :attribute has already been taken.',
    'uploaded' => 'The :attribute failed to upload.',
    'url' => 'The :attribute format is invalid.',
    'uuid' => 'The :attribute must be a valid UUID.',
    // Added rule
    'kana'                 => 'The :attribute is valid only for hiragana or katakana.',
    'japanese_post_code'   => 'The :attribute is valid only for 7 digit numbers without hyphen.',
    'japanese_phone_number' => 'The :attribute is valid only for domestic phone numbers.',

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | Here you may specify custom validation messages for attributes using the
    | convention "attribute.rule" to name the lines. This makes it quick to
    | specify a specific custom language line for a given attribute rule.
    |
    */

    'custom' => [
        // USER ORDERS
        'delivery_date' => [
            'after' => 'Need to select preferred delivery date after tomorrow.',
        ]
    ],

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Attributes
    |--------------------------------------------------------------------------
    |
    | The following language lines are used to swap our attribute placeholder
    | with something more reader friendly such as "E-Mail Address" instead
    | of "email". This simply helps us make our message more expressive.
    |
    */

    'attributes' => [
        // ADMIN ADMINS
        'last_name' => 'last name',
        'first_name' => 'first name',
        'last_name_kana' => 'last name (kana)',
        'first_name_kana' => 'first name (kana)',
        'tel' => 'tel',
        'email' => 'email',
        'password' => 'password',
        // ADMIN BLOGS
        'title' => 'title',
        'body' => 'body',
        'brand_id' => 'brand category',
        'category_id' => 'gender category',
        'items_id.*' => 'related product number',
        'tags_id.*' => 'related tag',
        'is_published' => 'published status',
        'file' => 'thumbnail',
        'thumbnail' => 'thumbnail',
        // ADMIN BRANDS
        'brand_name' => 'brand name',
        // ADMIN CATEGORY 
        'category_name' => 'category name',
        'parent_id' => 'parent category ID',
        // ADMIN COLORS
        'color_name' => 'color name',
        // ADMIN CONTACTS
        'response_status' => 'response status',
        'memo' => 'memo',
        // ADMIN ITEMS
        'product_number' => 'product number',
        'item_name' => 'product name',
        'price' => 'price',
        'cost' => 'cost',
        'made_in' => 'country of origin',
        'mixture_ratio' => 'mixture ratio',
        'description' => 'description',
        // 'is_published' => 'published status',
        // 'brand_id' => 'brand Category',
        'gender_category' => 'gender category',
        'main_category' => 'main category',
        'sub_category' => 'sub category',
        // 'tags_id.*' => 'related tag',
        'skus.*.id' => 'SKU ID',
        'skus.*.item_id' => 'item ID',
        'skus.*.size_id' => 'size',
        'skus.*.color_id' => 'color',
        'skus.*.quantity' => 'stock',
        'images.*.id' => 'image ID',
        'images.*.item_id' => 'item ID',
        'images.*.color_id' => 'related color',
        'images.*.image' => 'image',
        'images.*.image_category' => 'image type',
        'images.*.file' => 'image file',
        'measurements.*.id' => 'measurement ID',
        'measurements.*.size_id' => 'size',
        'measurements.*.width' => 'width',
        'measurements.*.shoulder_width' => 'shoulder width',
        'measurements.*.raglan_sleeve_length' => 'raglan sleeve length',
        'measurements.*.sleeve_length' => 'sleeve length',
        'measurements.*.length' => 'length',
        'measurements.*.waist' => 'waist',
        'measurements.*.hip' => 'hip',
        'measurements.*.rise' => 'rise',
        'measurements.*.inseam' => 'inseam',
        'measurements.*.thigh_width' => 'thigh width',
        'measurements.*.outseam' => 'outseam',
        'measurements.*.sk_length' => 'SK length',
        'measurements.*.hem_width' => 'hem width',
        'measurements.*.weight' => 'weight',
        // ADMIN NEWS
        // 'title' => 'title',
        // 'body' => 'body',
        // 'brand_id' => 'brand category',
        // 'category_id' => 'gender category',
        // 'tags_id.*' => 'related tag',
        // 'is_published' => 'published status',
        // 'file' => 'thumbnail',
        // 'thumbnail' => 'thumbnail',
        // ADMIN NOTIFICATIONS
        // 'title' => 'title',
        // 'body' => 'body',
        // 'is_published' => 'published status',
        'expired_at' => 'expired date',
        // ADMIN ORDERS
        'is_paid' => 'payment status',
        'is_shipped' => 'delivery status',
        'delivery_date' => 'preferred delivery day',
        'delivery_time' => 'preferred delivery time',
        // ADMIN RESET_PASSWORDS
        'uuid' => 'unique key',
        // 'password' => 'password',
        // 'email' => 'email',
        // ADMIN SIZES
        'size_name' => 'size name',
        // ADMIN TAGS
        'tag_name' => 'tag name',
        // ADMIN USERS
        // 'last_name' => 'last name',
        // 'first_name' => 'first name',
        // 'last_name_kana' => 'last name (kana)',
        // 'first_name_kana' => 'first name (kana)',
        'gender' => 'gender',
        'birthday' => 'birthday',
        'post_code' => 'postcode',
        'prefecture' => 'prefecture',
        'municipality' => 'municipality',
        'street_name' => 'street name',
        'street_number' => 'street number',
        'building' => 'building',
        'delivery_post_code' => 'postcode',
        'delivery_prefecture' => 'prefecture',
        'delivery_municipality' => 'municipality',
        'delivery_street_name' => 'street name',
        'delivery_street_number' => 'street number',
        'delivery_building' => 'building',
        // 'tel' => 'tel',
        // 'email' => 'email',
        // 'password' => 'password',
        'is_received' => 'DM',
        // USER BOOKMARKS
        'sku_id' => 'SKU ID',
        // USER CARTS
        'quantity' => 'quantity',
        // 'sku_id' => 'SKU ID',
        // USER CONTACTS
        // 'last_name' => 'last name',
        // 'first_name' => 'first name',
        // 'last_name_kana' => 'last name (kana)',
        // 'first_name_kana' => 'first name (kana)',
        // 'tel' => 'tel',
        // 'email' => 'email',
        'subject' => 'subject',
        'message' => 'message',
        // USER ORDERS
        'payment_token' => 'payment token',
        'total_amount' => 'total amount',
        'payment_method' => 'payment method',
        // 'delivery_date' => 'preferred delivery day',
        // 'delivery_time' => 'preferred delivery time',
        // USER RESET_PASSWORDS
        // 'uuid' => 'unique key',
        // 'password' => 'password',
        // 'email' => 'email',
        // USER USERS
        // 'last_name' => 'last name',
        // 'first_name' => 'first name',
        // 'last_name_kana' => 'last name (kana)',
        // 'first_name_kana' => 'first name (kana)',
        // 'gender' => 'gender',
        // 'birthday' => 'birthday',
        // 'post_code' => 'postcode',
        // 'prefecture' => 'prefecture',
        // 'municipality' => 'municipality',
        // 'street_name' => 'street name',
        // 'street_number' => 'street number',
        // 'building' => 'building',
        // 'delivery_post_code' => 'postcode',
        // 'delivery_prefecture' => 'prefecture',
        // 'delivery_municipality' => 'municipality',
        // 'delivery_street_name' => 'street name',
        // 'delivery_street_number' => 'street number',
        // 'delivery_building' => 'building',
        // 'tel' => 'tel',
        // 'email' => 'email',
        // 'is_received' => 'DM',
        // 'password' => 'password'
    ],

];

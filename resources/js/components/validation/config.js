import useI18next from '../context/I18nextContext';

const validationConfig =  () => {

  const i18next = useI18next();

  return {
    admin : {
      admin_create : {
        rules : {
          'last_name': 'required|string|max:25',
          'first_name': 'required|string|max:25',
          'last_name_kana': 'string|max:25', // かな判定追加する
          'first_name_kana': 'string|max:25', // かな判定追加する
          'tel': 'required|string|max:15', // 日本のサービスなので日本語の電話番号かの判定ロジック必要
          'email': 'required|email|max:100',
          'password': 'required|string|alpha_num|min:8|max:100'
        },
        attributes : { 
          'last_name': i18next.t('validation.admin.admin.last_name'),
          'first_name': i18next.t('validation.admin.admin.first_name'),
          'last_name_kana': i18next.t('validation.admin.admin.last_name_kana'),
          'first_name_kana': i18next.t('validation.admin.admin.first_name_kana'),
          'tel': i18next.t('validation.admin.admin.tel'),
          'email': i18next.t('validation.admin.admin.email'),
          'password': i18next.t('validation.admin.admin.password')
        }
      },
      admin_edit : {
        rules : {
          'last_name': 'required|string|max:25',
          'first_name': 'required|string|max:25',
          'last_name_kana': 'string|max:25', // かな判定追加する
          'first_name_kana': 'string|max:25', // かな判定追加する
          'tel': 'required|string|max:15', // 日本のサービスなので日本語の電話番号かの判定ロジック必要
          'email': 'required|email|max:100'
        },
        attributes : { 
          'last_name': i18next.t('validation.admin.admin.last_name'),
          'first_name': i18next.t('validation.admin.admin.first_name'),
          'last_name_kana': i18next.t('validation.admin.admin.last_name_kana'),
          'first_name_kana': i18next.t('validation.admin.admin.first_name_kana'),
          'tel': i18next.t('validation.admin.admin.tel'),
          'email': i18next.t('validation.admin.admin.email')
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
          'last_name': i18next.t('validation.admin.user.last_name'),
          'first_name': i18next.t('validation.admin.user.first_name'),
          'last_name_kana': i18next.t('validation.admin.user.last_name_kana'),
          'first_name_kana': i18next.t('validation.admin.user.first_name_kana'),
          'gender': i18next.t('validation.admin.user.gender'),
          'birthday': i18next.t('validation.admin.user.birthday'),
          'post_code': i18next.t('validation.admin.user.post_code'),
          'prefecture': i18next.t('validation.admin.user.prefecture'),
          'municipality': i18next.t('validation.admin.user.municipality'),
          'street_name': i18next.t('validation.admin.user.street_name'),
          'street_number': i18next.t('validation.admin.user.street_number'),
          'building': i18next.t('validation.admin.user.building'),
          'delivery_post_code': i18next.t('validation.admin.user.delivery_post_code'),
          'delivery_prefecture': i18next.t('validation.admin.user.delivery_prefecture'),
          'delivery_municipality': i18next.t('validation.admin.user.delivery_municipality'),
          'delivery_street_name': i18next.t('validation.admin.user.delivery_street_name'),
          'delivery_street_number': i18next.t('validation.admin.user.delivery_street_number'),
          'delivery_building': i18next.t('validation.admin.user.delivery_building'),
          'tel': i18next.t('validation.admin.user.tel'),
          'email': i18next.t('validation.admin.user.email'),
          'password': i18next.t('validation.admin.user.password'),
          'is_received': i18next.t('validation.admin.user.is_received')
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
          'last_name': i18next.t('validation.admin.user.last_name'),
          'first_name': i18next.t('validation.admin.user.first_name'),
          'last_name_kana': i18next.t('validation.admin.user.last_name_kana'),
          'first_name_kana': i18next.t('validation.admin.user.first_name_kana'),
          'gender': i18next.t('validation.admin.user.gender'),
          'birthday': i18next.t('validation.admin.user.birthday'),
          'post_code': i18next.t('validation.admin.user.post_code'),
          'prefecture': i18next.t('validation.admin.user.prefecture'),
          'municipality': i18next.t('validation.admin.user.municipality'),
          'street_name': i18next.t('validation.admin.user.street_name'),
          'street_number': i18next.t('validation.admin.user.street_number'),
          'building': i18next.t('validation.admin.user.building'),
          'delivery_post_code': i18next.t('validation.admin.user.delivery_post_code'),
          'delivery_prefecture': i18next.t('validation.admin.user.delivery_prefecture'),
          'delivery_municipality': i18next.t('validation.admin.user.delivery_municipality'),
          'delivery_street_name': i18next.t('validation.admin.user.delivery_street_name'),
          'delivery_street_number': i18next.t('validation.admin.user.delivery_street_number'),
          'delivery_building': i18next.t('validation.admin.user.delivery_building'),
          'tel': i18next.t('validation.admin.user.tel'),
          'email': i18next.t('validation.admin.user.email'),
          'is_received': i18next.t('validation.admin.user.is_received')
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
          'title': i18next.t('validation.admin.notification.title'),
          'body': i18next.t('validation.admin.notification.body'),
          'is_published': i18next.t('validation.admin.notification.is_published'),
          'expired_at': i18next.t('validation.admin.notification.expired_at')
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
          'product_number': i18next.t('validation.admin.item.product_number'),
          'item_name': i18next.t('validation.admin.item.item_name'),
          'price': i18next.t('validation.admin.item.price'),
          'cost': i18next.t('validation.admin.item.cost'),
          'made_in': i18next.t('validation.admin.item.made_in'),
          'mixture_ratio': i18next.t('validation.admin.item.mixture_ratio'),
          'description': i18next.t('validation.admin.item.description'),
          'is_published': i18next.t('validation.admin.item.is_published'),
          'brand_id': i18next.t('validation.admin.item.brand_id'),
          'gender_category': i18next.t('validation.admin.item.gender_category'),
          'main_category': i18next.t('validation.admin.item.main_category'),
          'sub_category': i18next.t('validation.admin.item.sub_category'),
          'tags_id.*': i18next.t('validation.admin.item.tags_id.*'),
          'skus.*.size_id': i18next.t('validation.admin.item.skus.*.size_id'),
          'skus.*.color_id': i18next.t('validation.admin.item.skus.*.color_id'),
          'skus.*.quantity': i18next.t('validation.admin.item.skus.*.quantity'),
          'images.*.color_id': i18next.t('validation.admin.item.images.*.color_id'),
          'images.*.image': i18next.t('validation.admin.item.images.*.image'),
          'images.*.image_category': i18next.t('validation.admin.item.images.*.image_category'),
          'measurements.*.size_id': i18next.t('validation.admin.item.measurements.*.size_id'),
          'measurements.*.width': i18next.t('validation.admin.item.measurements.*.width'),
          'measurements.*.shoulder_width': i18next.t('validation.admin.item.measurements.*.shoulder_width'),
          'measurements.*.raglan_sleeve_length': i18next.t('validation.admin.item.measurements.*.raglan_sleeve_length'),
          'measurements.*.sleeve_length': i18next.t('validation.admin.item.measurements.*.sleeve_length'),
          'measurements.*.length': i18next.t('validation.admin.item.measurements.*.length'),
          'measurements.*.waist': i18next.t('validation.admin.item.measurements.*.waist'),
          'measurements.*.hip': i18next.t('validation.admin.item.measurements.*.hip'),
          'measurements.*.rise': i18next.t('validation.admin.item.measurements.*.rise'),
          'measurements.*.inseam': i18next.t('validation.admin.item.measurements.*.inseam'),
          'measurements.*.thigh_width': i18next.t('validation.admin.item.measurements.*.thigh_width'),
          'measurements.*.outseam': i18next.t('validation.admin.item.measurements.*.outseam'),
          'measurements.*.sk_length': i18next.t('validation.admin.item.measurements.*.sk_length'),
          'measurements.*.hem_width': i18next.t('validation.admin.item.measurements.*.hem_width'),
          'measurements.*.weight': i18next.t('validation.admin.item.measurements.*.weight')
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
          'product_number': i18next.t('validation.admin.item.product_number'),
          'item_name': i18next.t('validation.admin.item.item_name'),
          'price': i18next.t('validation.admin.item.price'),
          'cost': i18next.t('validation.admin.item.cost'),
          'made_in': i18next.t('validation.admin.item.made_in'),
          'mixture_ratio': i18next.t('validation.admin.item.mixture_ratio'),
          'description': i18next.t('validation.admin.item.description'),
          'is_published': i18next.t('validation.admin.item.is_published'),
          'brand_id': i18next.t('validation.admin.item.brand_id'),
          'gender_category': i18next.t('validation.admin.item.gender_category'),
          'main_category': i18next.t('validation.admin.item.main_category'),
          'sub_category': i18next.t('validation.admin.item.sub_category'),
          'tags_id.*': i18next.t('validation.admin.item.tags_id.*'),
          'skus.*.size_id': i18next.t('validation.admin.item.skus.*.size_id'),
          'skus.*.color_id': i18next.t('validation.admin.item.skus.*.color_id'),
          'skus.*.quantity': i18next.t('validation.admin.item.skus.*.quantity'),
          'images.*.color_id': i18next.t('validation.admin.item.images.*.color_id'),
          'images.*.image': i18next.t('validation.admin.item.images.*.image'),
          'images.*.image_category': i18next.t('validation.admin.item.images.*.image_category'),
          'measurements.*.size_id': i18next.t('validation.admin.item.measurements.*.size_id'),
          'measurements.*.width': i18next.t('validation.admin.item.measurements.*.width'),
          'measurements.*.shoulder_width': i18next.t('validation.admin.item.measurements.*.shoulder_width'),
          'measurements.*.raglan_sleeve_length': i18next.t('validation.admin.item.measurements.*.raglan_sleeve_length'),
          'measurements.*.sleeve_length': i18next.t('validation.admin.item.measurements.*.sleeve_length'),
          'measurements.*.length': i18next.t('validation.admin.item.measurements.*.length'),
          'measurements.*.waist': i18next.t('validation.admin.item.measurements.*.waist'),
          'measurements.*.hip': i18next.t('validation.admin.item.measurements.*.hip'),
          'measurements.*.rise': i18next.t('validation.admin.item.measurements.*.rise'),
          'measurements.*.inseam': i18next.t('validation.admin.item.measurements.*.inseam'),
          'measurements.*.thigh_width': i18next.t('validation.admin.item.measurements.*.thigh_width'),
          'measurements.*.outseam': i18next.t('validation.admin.item.measurements.*.outseam'),
          'measurements.*.sk_length': i18next.t('validation.admin.item.measurements.*.sk_length'),
          'measurements.*.hem_width': i18next.t('validation.admin.item.measurements.*.hem_width'),
          'measurements.*.weight': i18next.t('validation.admin.item.measurements.*.weight')
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
          'title': i18next.t('validation.admin.blog.title'),
          'body': i18next.t('validation.admin.blog.body'),
          'brand_id': i18next.t('validation.admin.blog.brand_id'),
          'category_id': i18next.t('validation.admin.blog.category_id'),
          'items_id.*': i18next.t('validation.admin.blog.items_id.*'),
          'tags_id.*': i18next.t('validation.admin.blog.tags_id.*'),
          'is_published': i18next.t('validation.admin.blog.is_published'),
          'file': i18next.t('validation.admin.blog.file'),
          'thumbnail': i18next.t('validation.admin.blog.thumbnail')
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
          'title': i18next.t('validation.admin.blog.title'),
          'body': i18next.t('validation.admin.blog.body'),
          'brand_id': i18next.t('validation.admin.blog.brand_id'),
          'category_id': i18next.t('validation.admin.blog.category_id'),
          'items_id.*': i18next.t('validation.admin.blog.items_id.*'),
          'tags_id.*': i18next.t('validation.admin.blog.tags_id.*'),
          'is_published': i18next.t('validation.admin.blog.is_published'),
          'thumbnail': i18next.t('validation.admin.blog.thumbnail')
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
          'title': i18next.t('validation.admin.news.title'),
          'body': i18next.t('validation.admin.news.body'),
          'brand_id': i18next.t('validation.admin.news.brand_id'),
          'category_id': i18next.t('validation.admin.news.category_id'),
          'tags_id.*': i18next.t('validation.admin.news.tags_id.*'),
          'is_published': i18next.t('validation.admin.news.is_published'),
          'file': i18next.t('validation.admin.news.file'),
          'thumbnail': i18next.t('validation.admin.news.thumbnail')
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
          'title': i18next.t('validation.admin.news.title'),
          'body': i18next.t('validation.admin.news.body'),
          'brand_id': i18next.t('validation.admin.news.brand_id'),
          'category_id': i18next.t('validation.admin.news.category_id'),
          'tags_id.*': i18next.t('validation.admin.news.tags_id.*'),
          'is_published': i18next.t('validation.admin.news.is_published'),
          'thumbnail': i18next.t('validation.admin.news.thumbnail')
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
          'is_paid': i18next.t('validation.admin.order.is_paid'),
          'is_shipped': i18next.t('validation.admin.order.is_shipped'),
          'delivery_date': i18next.t('validation.admin.order.delivery_date'), 
          'delivery_time': i18next.t('validation.admin.order.delivery_time')
        }
      },
      contact_request : {
        rules : {
          'response_status': 'required|integer|min:0|max:2',
          'memo': 'string'
        },
        attributes : { 
          'response_status': i18next.t('validation.admin.contact.response_status'),
          'memo': i18next.t('validation.admin.contact.memo')
        }
      },
      color_request : {
        rules : {
          'color_name': 'required|string|max:30'
        },
        attributes : { 
          'color_name': i18next.t('validation.admin.color.color_name')
        }
      },
      brand_request : {
        rules : {
          'brand_name': 'required|string|max:255'
        },
        attributes : { 
          'brand_name': i18next.t('validation.admin.brand.brand_name')
        }
      },
      tag_request : {
        rules : {
          'tag_name': 'required|string|max:255'
        },
        attributes : { 
          'tag_name': i18next.t('validation.admin.tag.tag_name')
        }
      },
      category_request : {
        rules : {
          'category_name': 'required|string|max:50'
        },
        attributes : { 
          'category_name': i18next.t('validation.admin.category.category_name')
        }
      },
      size_request : {
        rules : {
          'size_name': 'required|string|max:30'
        },
        attributes : { 
          'size_name': i18next.t('validation.admin.size.size_name')
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
          'subject': 'required|string|max:255', 
          'message': 'required|string'
        },
        attributes : { 
          'last_name': i18next.t('validation.user.contact.last_name'), 
          'first_name': i18next.t('validation.user.contact.first_name'), 
          'last_name_kana': i18next.t('validation.user.contact.last_name_kana'), 
          'first_name_kana': i18next.t('validation.user.contact.first_name_kana'), 
          'tel': i18next.t('validation.user.contact.tel'), 
          'email': i18next.t('validation.user.contact.email'), 
          'subject': i18next.t('validation.user.contact.subject'), 
          'message': i18next.t('validation.user.contact.message')
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
          'total_amount': i18next.t('validation.user.order.total_amount'),
          'payment_method': i18next.t('validation.user.order.payment_method'),
          'delivery_date': i18next.t('validation.user.order.delivery_date'),
          'delivery_time': i18next.t('validation.user.order.delivery_time')
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
          'last_name': i18next.t('validation.user.user.last_name'),
          'first_name': i18next.t('validation.user.user.first_name'),
          'last_name_kana': i18next.t('validation.user.user.last_name_kana'),
          'first_name_kana': i18next.t('validation.user.user.first_name_kana'),
          'gender': i18next.t('validation.user.user.gender'),
          'birthday': i18next.t('validation.user.user.birthday'),
          'post_code': i18next.t('validation.user.user.post_code'),
          'prefecture': i18next.t('validation.user.user.prefecture'),
          'municipality': i18next.t('validation.user.user.municipality'),
          'street_name': i18next.t('validation.user.user.street_name'),
          'street_number': i18next.t('validation.user.user.street_number'),
          'building': i18next.t('validation.user.user.building'),
          'delivery_post_code': i18next.t('validation.user.user.delivery_post_code'),
          'delivery_prefecture': i18next.t('validation.user.user.delivery_prefecture'),
          'delivery_municipality': i18next.t('validation.user.user.delivery_municipality'),
          'delivery_street_name': i18next.t('validation.user.user.delivery_street_name'),
          'delivery_street_number': i18next.t('validation.user.user.delivery_street_number'),
          'delivery_building': i18next.t('validation.user.user.delivery_building'),
          'tel': i18next.t('validation.user.user.tel'),
          'email': i18next.t('validation.user.user.email'),
          'password': i18next.t('validation.user.user.password'),
          'is_received': i18next.t('validation.user.user.is_received')
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
          'last_name': i18next.t('validation.user.user.last_name'),
          'first_name': i18next.t('validation.user.user.first_name'),
          'last_name_kana': i18next.t('validation.user.user.last_name_kana'),
          'first_name_kana': i18next.t('validation.user.user.first_name_kana'),
          'gender': i18next.t('validation.user.user.gender'),
          'birthday': i18next.t('validation.user.user.birthday'),
          'post_code': i18next.t('validation.user.user.post_code'),
          'prefecture': i18next.t('validation.user.user.prefecture'),
          'municipality': i18next.t('validation.user.user.municipality'),
          'street_name': i18next.t('validation.user.user.street_name'),
          'street_number': i18next.t('validation.user.user.street_number'),
          'building': i18next.t('validation.user.user.building'),
          'delivery_post_code': i18next.t('validation.user.user.delivery_post_code'),
          'delivery_prefecture': i18next.t('validation.user.user.delivery_prefecture'),
          'delivery_municipality': i18next.t('validation.user.user.delivery_municipality'),
          'delivery_street_name': i18next.t('validation.user.user.delivery_street_name'),
          'delivery_street_number': i18next.t('validation.user.user.delivery_street_number'),
          'delivery_building': i18next.t('validation.user.user.delivery_building'),
          'tel': i18next.t('validation.user.user.tel'),
          'email': i18next.t('validation.user.user.email'),
          'is_received': i18next.t('validation.user.user.is_received')
        }
      }
      // ChangePasswordRequest
      // ResetPasswordRequest
    }
  }

}

export default validationConfig;


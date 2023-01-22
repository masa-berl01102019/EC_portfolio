import { useTranslation } from 'react-i18next';

const validationConfig =  () => {

  const { t } = useTranslation();

  // TODO: Add regular expression to judge kana character / Japanese postcode / Japanese tel

  return {
    admin : {
      admin_create : {
        rules : {
          'last_name': 'required|string|max:25',
          'first_name': 'required|string|max:25',
          'last_name_kana': 'string|max:25',
          'first_name_kana': 'string|max:25',
          'tel': 'required|string|max:15',
          'email': 'required|email|max:100',
          'password': 'required|string|alpha_num|min:8|max:100'
        },
        attributes : { 
          'last_name': t('validation.admin.admin.last_name'),
          'first_name': t('validation.admin.admin.first_name'),
          'last_name_kana': t('validation.admin.admin.last_name_kana'),
          'first_name_kana': t('validation.admin.admin.first_name_kana'),
          'tel': t('validation.admin.admin.tel'),
          'email': t('validation.admin.admin.email'),
          'password': t('validation.admin.admin.password')
        }
      },
      admin_edit : {
        rules : {
          'last_name': 'required|string|max:25',
          'first_name': 'required|string|max:25',
          'last_name_kana': 'string|max:25',
          'first_name_kana': 'string|max:25',
          'tel': 'required|string|max:15',
          'email': 'required|email|max:100'
        },
        attributes : { 
          'last_name': t('validation.admin.admin.last_name'),
          'first_name': t('validation.admin.admin.first_name'),
          'last_name_kana': t('validation.admin.admin.last_name_kana'),
          'first_name_kana': t('validation.admin.admin.first_name_kana'),
          'tel': t('validation.admin.admin.tel'),
          'email': t('validation.admin.admin.email')
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
          'last_name': t('validation.admin.user.last_name'),
          'first_name': t('validation.admin.user.first_name'),
          'last_name_kana': t('validation.admin.user.last_name_kana'),
          'first_name_kana': t('validation.admin.user.first_name_kana'),
          'gender': t('validation.admin.user.gender'),
          'birthday': t('validation.admin.user.birthday'),
          'post_code': t('validation.admin.user.post_code'),
          'prefecture': t('validation.admin.user.prefecture'),
          'municipality': t('validation.admin.user.municipality'),
          'street_name': t('validation.admin.user.street_name'),
          'street_number': t('validation.admin.user.street_number'),
          'building': t('validation.admin.user.building'),
          'delivery_post_code': t('validation.admin.user.delivery_post_code'),
          'delivery_prefecture': t('validation.admin.user.delivery_prefecture'),
          'delivery_municipality': t('validation.admin.user.delivery_municipality'),
          'delivery_street_name': t('validation.admin.user.delivery_street_name'),
          'delivery_street_number': t('validation.admin.user.delivery_street_number'),
          'delivery_building': t('validation.admin.user.delivery_building'),
          'tel': t('validation.admin.user.tel'),
          'email': t('validation.admin.user.email'),
          'password': t('validation.admin.user.password'),
          'is_received': t('validation.admin.user.is_received')
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
          'last_name': t('validation.admin.user.last_name'),
          'first_name': t('validation.admin.user.first_name'),
          'last_name_kana': t('validation.admin.user.last_name_kana'),
          'first_name_kana': t('validation.admin.user.first_name_kana'),
          'gender': t('validation.admin.user.gender'),
          'birthday': t('validation.admin.user.birthday'),
          'post_code': t('validation.admin.user.post_code'),
          'prefecture': t('validation.admin.user.prefecture'),
          'municipality': t('validation.admin.user.municipality'),
          'street_name': t('validation.admin.user.street_name'),
          'street_number': t('validation.admin.user.street_number'),
          'building': t('validation.admin.user.building'),
          'delivery_post_code': t('validation.admin.user.delivery_post_code'),
          'delivery_prefecture': t('validation.admin.user.delivery_prefecture'),
          'delivery_municipality': t('validation.admin.user.delivery_municipality'),
          'delivery_street_name': t('validation.admin.user.delivery_street_name'),
          'delivery_street_number': t('validation.admin.user.delivery_street_number'),
          'delivery_building': t('validation.admin.user.delivery_building'),
          'tel': t('validation.admin.user.tel'),
          'email': t('validation.admin.user.email'),
          'is_received': t('validation.admin.user.is_received')
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
          'title': t('validation.admin.notification.title'),
          'body': t('validation.admin.notification.body'),
          'is_published': t('validation.admin.notification.is_published'),
          'expired_at': t('validation.admin.notification.expired_at')
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
          'product_number': t('validation.admin.item.product_number'),
          'item_name': t('validation.admin.item.item_name'),
          'price': t('validation.admin.item.price'),
          'cost': t('validation.admin.item.cost'),
          'made_in': t('validation.admin.item.made_in'),
          'mixture_ratio': t('validation.admin.item.mixture_ratio'),
          'description': t('validation.admin.item.description'),
          'is_published': t('validation.admin.item.is_published'),
          'brand_id': t('validation.admin.item.brand_id'),
          'gender_category': t('validation.admin.item.gender_category'),
          'main_category': t('validation.admin.item.main_category'),
          'sub_category': t('validation.admin.item.sub_category'),
          'tags_id.*': t('validation.admin.item.tags_id.*'),
          'skus.*.size_id': t('validation.admin.item.skus.*.size_id'),
          'skus.*.color_id': t('validation.admin.item.skus.*.color_id'),
          'skus.*.quantity': t('validation.admin.item.skus.*.quantity'),
          'images.*.color_id': t('validation.admin.item.images.*.color_id'),
          'images.*.image': t('validation.admin.item.images.*.image'),
          'images.*.image_category': t('validation.admin.item.images.*.image_category'),
          'measurements.*.size_id': t('validation.admin.item.measurements.*.size_id'),
          'measurements.*.width': t('validation.admin.item.measurements.*.width'),
          'measurements.*.shoulder_width': t('validation.admin.item.measurements.*.shoulder_width'),
          'measurements.*.raglan_sleeve_length': t('validation.admin.item.measurements.*.raglan_sleeve_length'),
          'measurements.*.sleeve_length': t('validation.admin.item.measurements.*.sleeve_length'),
          'measurements.*.length': t('validation.admin.item.measurements.*.length'),
          'measurements.*.waist': t('validation.admin.item.measurements.*.waist'),
          'measurements.*.hip': t('validation.admin.item.measurements.*.hip'),
          'measurements.*.rise': t('validation.admin.item.measurements.*.rise'),
          'measurements.*.inseam': t('validation.admin.item.measurements.*.inseam'),
          'measurements.*.thigh_width': t('validation.admin.item.measurements.*.thigh_width'),
          'measurements.*.outseam': t('validation.admin.item.measurements.*.outseam'),
          'measurements.*.sk_length': t('validation.admin.item.measurements.*.sk_length'),
          'measurements.*.hem_width': t('validation.admin.item.measurements.*.hem_width'),
          'measurements.*.weight': t('validation.admin.item.measurements.*.weight')
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
          'product_number': t('validation.admin.item.product_number'),
          'item_name': t('validation.admin.item.item_name'),
          'price': t('validation.admin.item.price'),
          'cost': t('validation.admin.item.cost'),
          'made_in': t('validation.admin.item.made_in'),
          'mixture_ratio': t('validation.admin.item.mixture_ratio'),
          'description': t('validation.admin.item.description'),
          'is_published': t('validation.admin.item.is_published'),
          'brand_id': t('validation.admin.item.brand_id'),
          'gender_category': t('validation.admin.item.gender_category'),
          'main_category': t('validation.admin.item.main_category'),
          'sub_category': t('validation.admin.item.sub_category'),
          'tags_id.*': t('validation.admin.item.tags_id.*'),
          'skus.*.size_id': t('validation.admin.item.skus.*.size_id'),
          'skus.*.color_id': t('validation.admin.item.skus.*.color_id'),
          'skus.*.quantity': t('validation.admin.item.skus.*.quantity'),
          'images.*.color_id': t('validation.admin.item.images.*.color_id'),
          'images.*.image': t('validation.admin.item.images.*.image'),
          'images.*.image_category': t('validation.admin.item.images.*.image_category'),
          'measurements.*.size_id': t('validation.admin.item.measurements.*.size_id'),
          'measurements.*.width': t('validation.admin.item.measurements.*.width'),
          'measurements.*.shoulder_width': t('validation.admin.item.measurements.*.shoulder_width'),
          'measurements.*.raglan_sleeve_length': t('validation.admin.item.measurements.*.raglan_sleeve_length'),
          'measurements.*.sleeve_length': t('validation.admin.item.measurements.*.sleeve_length'),
          'measurements.*.length': t('validation.admin.item.measurements.*.length'),
          'measurements.*.waist': t('validation.admin.item.measurements.*.waist'),
          'measurements.*.hip': t('validation.admin.item.measurements.*.hip'),
          'measurements.*.rise': t('validation.admin.item.measurements.*.rise'),
          'measurements.*.inseam': t('validation.admin.item.measurements.*.inseam'),
          'measurements.*.thigh_width': t('validation.admin.item.measurements.*.thigh_width'),
          'measurements.*.outseam': t('validation.admin.item.measurements.*.outseam'),
          'measurements.*.sk_length': t('validation.admin.item.measurements.*.sk_length'),
          'measurements.*.hem_width': t('validation.admin.item.measurements.*.hem_width'),
          'measurements.*.weight': t('validation.admin.item.measurements.*.weight')
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
          'title': t('validation.admin.blog.title'),
          'body': t('validation.admin.blog.body'),
          'brand_id': t('validation.admin.blog.brand_id'),
          'category_id': t('validation.admin.blog.category_id'),
          'items_id.*': t('validation.admin.blog.items_id.*'),
          'tags_id.*': t('validation.admin.blog.tags_id.*'),
          'is_published': t('validation.admin.blog.is_published'),
          'file': t('validation.admin.blog.file'),
          'thumbnail': t('validation.admin.blog.thumbnail')
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
          'title': t('validation.admin.blog.title'),
          'body': t('validation.admin.blog.body'),
          'brand_id': t('validation.admin.blog.brand_id'),
          'category_id': t('validation.admin.blog.category_id'),
          'items_id.*': t('validation.admin.blog.items_id.*'),
          'tags_id.*': t('validation.admin.blog.tags_id.*'),
          'is_published': t('validation.admin.blog.is_published'),
          'thumbnail': t('validation.admin.blog.thumbnail')
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
          'title': t('validation.admin.news.title'),
          'body': t('validation.admin.news.body'),
          'brand_id': t('validation.admin.news.brand_id'),
          'category_id': t('validation.admin.news.category_id'),
          'tags_id.*': t('validation.admin.news.tags_id.*'),
          'is_published': t('validation.admin.news.is_published'),
          'file': t('validation.admin.news.file'),
          'thumbnail': t('validation.admin.news.thumbnail')
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
          'title': t('validation.admin.news.title'),
          'body': t('validation.admin.news.body'),
          'brand_id': t('validation.admin.news.brand_id'),
          'category_id': t('validation.admin.news.category_id'),
          'tags_id.*': t('validation.admin.news.tags_id.*'),
          'is_published': t('validation.admin.news.is_published'),
          'thumbnail': t('validation.admin.news.thumbnail')
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
          'is_paid': t('validation.admin.order.is_paid'),
          'is_shipped': t('validation.admin.order.is_shipped'),
          'delivery_date': t('validation.admin.order.delivery_date'), 
          'delivery_time': t('validation.admin.order.delivery_time')
        }
      },
      contact_request : {
        rules : {
          'response_status': 'required|integer|min:0|max:2',
          'memo': 'string'
        },
        attributes : { 
          'response_status': t('validation.admin.contact.response_status'),
          'memo': t('validation.admin.contact.memo')
        }
      },
      color_request : {
        rules : {
          'color_name': 'required|string|max:30'
        },
        attributes : { 
          'color_name': t('validation.admin.color.color_name')
        }
      },
      brand_request : {
        rules : {
          'brand_name': 'required|string|max:255'
        },
        attributes : { 
          'brand_name': t('validation.admin.brand.brand_name')
        }
      },
      tag_request : {
        rules : {
          'tag_name': 'required|string|max:255'
        },
        attributes : { 
          'tag_name': t('validation.admin.tag.tag_name')
        }
      },
      category_request : {
        rules : {
          'category_name': 'required|string|max:50'
        },
        attributes : { 
          'category_name': t('validation.admin.category.category_name')
        }
      },
      size_request : {
        rules : {
          'size_name': 'required|string|max:30'
        },
        attributes : { 
          'size_name': t('validation.admin.size.size_name')
        }
      },
      change_password_request : {
        rules : {
          'password' : 'required|string|alpha_num|min:8|max:100'
        },
        attributes : { 
          'password': t('validation.admin.auth.password')
        }
      },
      reset_password_request : {
        rules : {
          'email' : 'required|email|max:100'
        },
        attributes : { 
          'email': t('validation.admin.auth.email')
        }
      },
      login_request : {
        rules : {
          'email' : 'required|email|max:100',
          'password' : 'required|string|alpha_num|min:8|max:100',
        },
        attributes : { 
          'email': t('validation.admin.auth.email'),
          'password': t('validation.admin.auth.password')
        }
      }
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
          'last_name': t('validation.user.contact.last_name'), 
          'first_name': t('validation.user.contact.first_name'), 
          'last_name_kana': t('validation.user.contact.last_name_kana'), 
          'first_name_kana': t('validation.user.contact.first_name_kana'), 
          'tel': t('validation.user.contact.tel'), 
          'email': t('validation.user.contact.email'), 
          'subject': t('validation.user.contact.subject'), 
          'message': t('validation.user.contact.message')
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
          'total_amount': t('validation.user.order.total_amount'),
          'payment_method': t('validation.user.order.payment_method'),
          'delivery_date': t('validation.user.order.delivery_date'),
          'delivery_time': t('validation.user.order.delivery_time')
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
          'last_name': t('validation.user.user.last_name'),
          'first_name': t('validation.user.user.first_name'),
          'last_name_kana': t('validation.user.user.last_name_kana'),
          'first_name_kana': t('validation.user.user.first_name_kana'),
          'gender': t('validation.user.user.gender'),
          'birthday': t('validation.user.user.birthday'),
          'post_code': t('validation.user.user.post_code'),
          'prefecture': t('validation.user.user.prefecture'),
          'municipality': t('validation.user.user.municipality'),
          'street_name': t('validation.user.user.street_name'),
          'street_number': t('validation.user.user.street_number'),
          'building': t('validation.user.user.building'),
          'delivery_post_code': t('validation.user.user.delivery_post_code'),
          'delivery_prefecture': t('validation.user.user.delivery_prefecture'),
          'delivery_municipality': t('validation.user.user.delivery_municipality'),
          'delivery_street_name': t('validation.user.user.delivery_street_name'),
          'delivery_street_number': t('validation.user.user.delivery_street_number'),
          'delivery_building': t('validation.user.user.delivery_building'),
          'tel': t('validation.user.user.tel'),
          'email': t('validation.user.user.email'),
          'password': t('validation.user.user.password'),
          'is_received': t('validation.user.user.is_received')
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
          'last_name': t('validation.user.user.last_name'),
          'first_name': t('validation.user.user.first_name'),
          'last_name_kana': t('validation.user.user.last_name_kana'),
          'first_name_kana': t('validation.user.user.first_name_kana'),
          'gender': t('validation.user.user.gender'),
          'birthday': t('validation.user.user.birthday'),
          'post_code': t('validation.user.user.post_code'),
          'prefecture': t('validation.user.user.prefecture'),
          'municipality': t('validation.user.user.municipality'),
          'street_name': t('validation.user.user.street_name'),
          'street_number': t('validation.user.user.street_number'),
          'building': t('validation.user.user.building'),
          'delivery_post_code': t('validation.user.user.delivery_post_code'),
          'delivery_prefecture': t('validation.user.user.delivery_prefecture'),
          'delivery_municipality': t('validation.user.user.delivery_municipality'),
          'delivery_street_name': t('validation.user.user.delivery_street_name'),
          'delivery_street_number': t('validation.user.user.delivery_street_number'),
          'delivery_building': t('validation.user.user.delivery_building'),
          'tel': t('validation.user.user.tel'),
          'email': t('validation.user.user.email'),
          'is_received': t('validation.user.user.is_received')
        }
      },
      change_password_request : {
        rules : {
          'password' : 'required|string|alpha_num|min:8|max:100'
        },
        attributes : { 
          'password': t('validation.user.auth.password')
        }
      },
      reset_password_request : {
        rules : {
          'email' : 'required|email|max:100'
        },
        attributes : { 
          'email': t('validation.user.auth.email')
        }
      },
      login_request : {
        rules : {
          'email' : 'required|email|max:100',
          'password' : 'required|string|alpha_num|min:8|max:100',
        },
        attributes : { 
          'email': t('validation.user.auth.email'),
          'password': t('validation.user.auth.password')
        }
      }
    }
  }

}

export default validationConfig;


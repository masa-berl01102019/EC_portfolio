import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import Image from '../../../atoms/Image/Image';
import Text from '../../../atoms/Text/Text';
import styles from './styles.module.css';
import CartBtn from '../../../molecules/IconBtn/CartBtn';
import { useTranslation } from 'react-i18next';
import { CONST } from '../../../constants/constants';

const OrderedItemCard = memo(({
  order,
  create_method,
  className = '',
  ...props
}) => {

  const { t } = useTranslation();

  return (
    <div {...props} className={[styles.flex, styles.mb_32, styles.ordered_item_card].join(' ')}>
      <Link to={`/items/${order.item_id}`} className={order.stock_status === CONST.STOCK_STATUS.SOLD_OUT ? styles.sold_out : ''}>
        <Image src={order.top_image} alt="item image" className={[styles.ordered_item_img].join(' ')} />
      </Link>
      <div className={styles.ordered_item_text_contents}>
        <Text className={[styles.card_text].join(' ')}>{order.brand_name}</Text>
        <Text className={[styles.card_text].join(' ')}>{order.item_name}</Text>
        <Text className={[styles.card_text].join(' ')}>
          {order.order_price_text} ({t('user.tax-including')})
        </Text>
        <Text className={[styles.card_text].join(' ')}>
          {order.order_color} / {order.order_size}
        </Text>
        <Text className={[styles.card_text].join(' ')}>{order.created_at}</Text>
        <CartBtn
          size='s'
          color='reverse'
          onClick={() => create_method()}
          disabled={
            order.cart_status === CONST.CART_STATUS.IN_CART ||
            order.stock_status === CONST.STOCK_STATUS.SOLD_OUT ||
            order.is_published === CONST.IS_PUBLISHED.NOT_PUBLISHED ||
            order.delete_status === CONST.DELETE_STATUS.DELETED
          }
          style={{ 'width': '172px' }}
        >
          {t('user.order.repurchase-btn')}
        </CartBtn>
      </div>
    </div>
  );

});

export default OrderedItemCard;
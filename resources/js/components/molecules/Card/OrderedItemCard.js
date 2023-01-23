import React, {memo} from 'react';
import {Link} from 'react-router-dom';
import Image from '../../atoms/Image/Image';
import Text from '../../atoms/Text/Text';
import styles from './styles.module.css';
import CartBtn from '../IconBtn/CartBtn';
import { useTranslation } from 'react-i18next';

const OrderedItemCard = ({
    src,
    to, 
    brand_name, 
    item_name, 
    price, 
    color_name, 
    size_name, 
    stock_status, 
    cart_status,
    created_at, 
    create_method, 
    is_published,
    delete_status,
    className = '',
    ...props
  }) => {

  const { t } = useTranslation();

  return (
    <div {...props} className={[styles.flex, styles.mb_32, styles.ordered_item_card].join(' ')}>
      <Link to={to} className={stock_status === 0 ? styles.sold_out : ''}>
        <Image src={src} alt="item image" className={[styles.ordered_item_img].join(' ')} />
      </Link>
      <div className={styles.ordered_item_text_contents}>
        <Text className={[styles.card_text].join(' ')}>{brand_name}</Text>
        <Text className={[styles.card_text].join(' ')}>{item_name}</Text>
        <Text className={[styles.card_text].join(' ')}>{price} ({t('user.tax-including')})</Text>
        <Text className={[styles.card_text].join(' ')}>{color_name} / {size_name}</Text>
        <Text className={[styles.card_text].join(' ')}>{created_at}</Text>
        <CartBtn size='s' color='reverse' onClick={ () => create_method() } disabled={cart_status !== 0 || stock_status === 0 || is_published !== 1 || delete_status === 1} style={{'width': '172px'}}>
          {t('user.order.repurchase-btn')}
        </CartBtn>
      </div>
    </div>
  );

};

export default OrderedItemCard;
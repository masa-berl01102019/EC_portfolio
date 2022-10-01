import React, {memo} from 'react';
import {Link} from 'react-router-dom';
import Image from '../../atoms/Image/Image';
import Text from '../../atoms/Text/Text';
import styles from './styles.module.css';
import CartBtn from '../IconBtn/CartBtn';

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
    className = '',
    ...props
  }) => {

  return (
    <div {...props} className={[styles.flex, styles.mb_16, styles.ordered_item_card].join(' ')}>
      <Link to={to}>
        <Image src={src} alt="商品画像" className={[styles.ordered_item_img].join(' ')} />
        { stock_status === 0 && <Text role='error'>在庫なし</Text>}
      </Link>
      <div className={styles.ordered_item_text_contents}>
        <Text className={[styles.card_text].join(' ')}>{brand_name}</Text>
        <Text className={[styles.card_text].join(' ')}>{item_name}</Text>
        <Text className={[styles.card_text].join(' ')}>{price} (税込)</Text>
        <Text className={[styles.card_text].join(' ')}>{color_name} / {size_name}</Text>
        <Text className={[styles.card_text].join(' ')}>{created_at}</Text>
        <CartBtn size='s' onClick={ () => create_method() } disabled={cart_status !== 0} style={{'width': '172px'}}>
          {cart_status === 0 ? 'カートに追加' : 'カート登録済'}
        </CartBtn>
      </div>
    </div>
  );

};

export default OrderedItemCard;
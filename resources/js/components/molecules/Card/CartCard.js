import React, {memo} from 'react';
import {Link} from 'react-router-dom';
import Image from '../../atoms/Image/Image';
import Text from '../../atoms/Text/Text';
import styles from './styles.module.css';
import DeleteBtn from '../IconBtn/DeleteBtn';
import InputText from '../../atoms/InputText/InputText';

const CartCard = ({
    src,
    to, 
    brand_name, 
    item_name, 
    price, 
    price_text, 
    color_name, 
    size_name, 
    stock_status,
    quantity, 
    update_method, 
    delete_method, 
    className = '',
    error,
    ...props
  }) => {

  return (
    <div {...props} className={[styles.mb_16, styles.cart_card, className].join(' ')}>
      <div className={styles.flex}>
          <Link to={to}>
              <Image src={src} alt="商品画像" className={styles.bookmark_img} />
              { stock_status === 0 && <Text role='error'>在庫なし</Text>}
          </Link>
          <div className={styles.bookmark_text_contents}>
              <Text className={[styles.mb_8, styles.card_text].join(' ')}>{brand_name}</Text>
              <Text className={[styles.mb_8, styles.card_text].join(' ')}>{item_name}</Text>
              <Text className={[styles.mb_8, styles.card_text].join(' ')}>{price_text} (税込)</Text>
              <Text className={[styles.mb_4, styles.card_text].join(' ')}>{color_name} / {size_name}</Text>
          </div>
      </div>
      <div className={styles.cart_input_area}>
          <label>
            <Text tag='span' className={styles.mr_4}>数量</Text>
            <InputText 
              type='number' 
              name='quantity' 
              defaultValue={quantity} 
              onBlur={update_method} 
              className={styles.quantity_input} 
            />
          </label>
          <Text>小計 ￥{Number(price * quantity).toLocaleString()} (税込)</Text>
          <DeleteBtn size='s' onClick={delete_method} className={styles.delete_btn}>削除</DeleteBtn>
      </div>
      { error && <Text size='s' role='error' className={styles.mt_8} >{error['quantity']}</Text> }
    </div>
  );

};

export default CartCard;
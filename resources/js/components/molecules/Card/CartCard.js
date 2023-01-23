import React, {memo} from 'react';
import {Link} from 'react-router-dom';
import Image from '../../atoms/Image/Image';
import Text from '../../atoms/Text/Text';
import styles from './styles.module.css';
import DeleteBtn from '../IconBtn/DeleteBtn';
import InputText from '../../atoms/InputText/InputText';
import useI18next from '../../context/I18nextContext';

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
    stock,
    quantity, 
    update_method, 
    delete_method, 
    className = '',
    error,
    ...props
  }) => {

  const i18next = useI18next();

  return (
    <div {...props} className={[styles.mb_16, styles.cart_card, className].join(' ')}>
      <div className={styles.flex}>
          <Link to={to} className={stock_status === 0 ? styles.sold_out : ''}>
              <Image src={src} alt="item image" className={styles.bookmark_img} />
          </Link>
          <div className={styles.bookmark_text_contents}>
              <Text className={[styles.mb_8, styles.card_text].join(' ')}>{brand_name}</Text>
              <Text className={[styles.mb_8, styles.card_text].join(' ')}>{item_name}</Text>
              <Text className={[styles.mb_8, styles.card_text].join(' ')}>{price_text} ({i18next.t('user.tax-including')})</Text>
              <Text className={[styles.mb_8, styles.card_text].join(' ')}>{color_name} / {size_name}</Text>
              <Text className={[styles.mb_4, styles.card_text].join(' ')}>{i18next.t('user.cart.stock-status')}: {stock > 100 ? '〇': stock > 10 ? '△' : stock < 1 ? '☓' : 'ー'}</Text>
          </div>
      </div>
      <div className={styles.cart_input_area}>
          <label>
            <Text tag='span' className={styles.mr_4}>{i18next.t('user.cart.quantity')}</Text>
            <InputText 
              type='number' 
              name='quantity' 
              defaultValue={quantity} 
              onBlur={update_method} 
              className={styles.quantity_input} 
            />
          </label>
          <Text>{i18next.t('user.cart.subtotal')} ￥{Number(price * quantity).toLocaleString()} ({i18next.t('user.cart.tax-including')})</Text>
          <DeleteBtn size='s' onClick={delete_method} className={styles.delete_btn}>{i18next.t('user.delete-btn')}</DeleteBtn>
      </div>
      { error && <Text size='s' role='error' className={styles.mt_8} >{error['quantity']}</Text> }
    </div>
  );

};

export default CartCard;
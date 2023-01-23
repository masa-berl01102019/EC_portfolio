import React, {memo} from 'react';
import {Link} from 'react-router-dom';
import Image from '../../atoms/Image/Image';
import Text from '../../atoms/Text/Text';
import styles from './styles.module.css';
import DeleteBtn from '../IconBtn/DeleteBtn';
import CartBtn from '../IconBtn/CartBtn';
import useI18next from '../../context/I18nextContext';

const BookmarkCard = ({
    src,
    to, 
    brand_name, 
    item_name, 
    price, 
    color_name, 
    size_name, 
    stock_status, 
    cart_status, 
    create_method, 
    delete_method, 
    className = '',
    ...props
  }) => {

  const i18next = useI18next();

  return (
    <div {...props} className={[styles.flex, styles.mb_32, styles.bookmark_card].join(' ')}>
        <Link to={to} className={stock_status === 0 ? styles.sold_out : ''}>
          <Image src={src} alt="item image" className={[styles.bookmark_img].join(' ')} />
        </Link>
        <div className={styles.bookmark_text_contents}>
          <Text className={[styles.mb_8, styles.card_text].join(' ')}>{brand_name}</Text>
          <Text className={[styles.mb_8, styles.card_text].join(' ')}>{item_name}</Text>
          <Text className={[styles.mb_8, styles.card_text].join(' ')}>{price} ({i18next.t('user.tax-including')})</Text>
          <Text className={[styles.mb_4, styles.card_text].join(' ')}>{color_name} / {size_name}</Text>
          <div className={styles.flex}>
            <CartBtn size='s' onClick={ () => create_method() } disabled={cart_status !== 0 || stock_status === 0} className={styles.mr_4} style={{'width': '114px'}}>
                {cart_status === 0 ? i18next.t('user.cart.register') : i18next.t('user.cart.registered')}
            </CartBtn>
            <DeleteBtn size='s' onClick={ () => delete_method() } style={{'width': '71px'}}>{i18next.t('user.delete-btn')}</DeleteBtn>
          </div>
        </div>
    </div>


  );

};

export default BookmarkCard;
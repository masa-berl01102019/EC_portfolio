import React, {memo} from 'react';
import {Link} from 'react-router-dom';
import Image from '../../atoms/Image/Image';
import Text from '../../atoms/Text/Text';
import styles from './styles.module.css';
import DeleteBtn from '../IconBtn/DeleteBtn';
import CartBtn from '../IconBtn/CartBtn';

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

  return (
    <div {...props} className={[styles.flex, styles.mb_32, styles.bookmark_card].join(' ')}>
        <Link to={to}>
          <Image src={src} alt="商品画像" className={[styles.bookmark_img].join(' ')} />
          { stock_status === 0 && <Text role='error'>在庫なし</Text>}
        </Link>
        <div className={styles.bookmark_text_contents}>
          <Text className={[styles.mb_8, styles.card_text].join(' ')}>{brand_name}</Text>
          <Text className={[styles.mb_8, styles.card_text].join(' ')}>{item_name}</Text>
          <Text className={[styles.mb_8, styles.card_text].join(' ')}>{price} (税込)</Text>
          <Text className={[styles.mb_4, styles.card_text].join(' ')}>{color_name} / {size_name}</Text>
          <div className={styles.flex}>
            <CartBtn size='s' onClick={ () => create_method() } disabled={cart_status !== 0 || stock_status === 0} className={styles.mr_4} style={{'width': '114px'}}>
                {cart_status === 0 ? 'カートに追加' : 'カート登録済'}
            </CartBtn>
            <DeleteBtn size='s' onClick={ () => delete_method() } style={{'width': '71px'}}>削除</DeleteBtn>
          </div>
        </div>
    </div>


  );

};

export default BookmarkCard;
import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import Image from '../../../atoms/Image/Image';
import Text from '../../../atoms/Text/Text';
import styles from './styles.module.css';
import DeleteBtn from '../../../molecules/IconBtn/DeleteBtn';
import CartBtn from '../../../molecules/IconBtn/CartBtn';
import { useTranslation } from 'react-i18next';
import { CONST } from '../../../constants/constants';

const BookmarkCard = memo(({
  bookmark,
  create_method,
  delete_method,
  className = '',
  ...props
}) => {

  const { t } = useTranslation();

  return (
    <div {...props} className={[styles.flex, styles.mb_32, styles.bookmark_card].join(' ')}>
      <Link to={`/items/${bookmark.item_id}`} className={bookmark.stock_status === CONST.STOCK_STATUS.SOLD_OUT ? styles.sold_out : ''}>
        <Image src={bookmark.top_image} alt="item image" className={[styles.bookmark_img].join(' ')} />
      </Link>
      <div className={styles.bookmark_text_contents}>
        <Text className={[styles.mb_8, styles.card_text].join(' ')}>{bookmark.brand_name}</Text>
        <Text className={[styles.mb_8, styles.card_text].join(' ')}>{bookmark.item_name}</Text>
        <Text className={[styles.mb_8, styles.card_text].join(' ')}>
          {bookmark.included_tax_price_text}({t('user.tax-including')})
        </Text>
        <Text className={[styles.mb_4, styles.card_text].join(' ')}>
          {bookmark.color_name} / {bookmark.size_name}
        </Text>
        <div className={styles.flex}>
          <CartBtn
            size='s'
            onClick={() => create_method()}
            disabled={bookmark.cart_status === CONST.CART_STATUS.IN_CART || bookmark.stock_status === CONST.STOCK_STATUS.SOLD_OUT}
            className={styles.mr_4} style={{ 'width': '114px' }}
          >
            {bookmark.cart_status === CONST.CART_STATUS.OUT_OF_CART ? t('user.cart.register') : t('user.cart.registered')}
          </CartBtn>
          <DeleteBtn
            size='s'
            onClick={() => delete_method()}
            style={{ 'width': '71px' }}
          >
            {t('user.delete-btn')}
          </DeleteBtn>
        </div>
      </div>
    </div>
  );
});

export default BookmarkCard;
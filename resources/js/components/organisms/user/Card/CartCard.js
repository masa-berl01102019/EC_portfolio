import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import Image from '../../../atoms/Image/Image';
import Text from '../../../atoms/Text/Text';
import styles from './styles.module.css';
import DeleteBtn from '../../../molecules/IconBtn/DeleteBtn';
import InputText from '../../../atoms/InputText/InputText';
import { useTranslation } from 'react-i18next';
import { CONST } from '../../../constants/constants';

const CartCard = memo(({
  cart,
  update_method,
  delete_method,
  className = '',
  error,
  ...props
}) => {

  const { t } = useTranslation();

  return (
    <div {...props} className={[styles.mb_16, styles.cart_card, className].join(' ')}>
      <div className={styles.flex}>
        <Link to={`/items/${cart.item_id}`} className={cart.stock_status === CONST.STOCK_STATUS.SOLD_OUT ? styles.sold_out : ''}>
          <Image src={cart.top_image} alt="item image" className={styles.bookmark_img} />
        </Link>
        <div className={styles.bookmark_text_contents}>
          <Text className={[styles.mb_8, styles.card_text].join(' ')}>{cart.brand_name}</Text>
          <Text className={[styles.mb_8, styles.card_text].join(' ')}>{cart.item_name}</Text>
          <Text className={[styles.mb_8, styles.card_text].join(' ')}>
            {cart.included_tax_price_text} ({t('user.tax-including')})
          </Text>
          <Text className={[styles.mb_8, styles.card_text].join(' ')}>
            {cart.color_name} / {cart.size_name}
          </Text>
          <Text className={[styles.mb_4, styles.card_text].join(' ')}>
            {t('user.cart.stock-status')}: {cart.stock > 100 ? '〇' : cart.stock > 10 ? '△' : cart.stock < 1 ? '☓' : 'ー'}
          </Text>
        </div>
      </div>
      <div className={styles.cart_input_area}>
        <label>
          <Text tag='span' className={styles.mr_4}>{t('user.cart.quantity')}</Text>
          <InputText
            type='number'
            name='quantity'
            defaultValue={cart.quantity}
            onBlur={update_method}
            className={styles.quantity_input}
          />
        </label>
        <Text>
          {t('user.cart.subtotal')} ￥{Number(cart.included_tax_price * cart.quantity).toLocaleString()}
          ({t('user.cart.tax-including')})
        </Text>
        <DeleteBtn
          size='s'
          onClick={delete_method}
          className={styles.delete_btn}
        >
          {t('user.delete-btn')}
        </DeleteBtn>
      </div>
      {error && <Text size='s' role='error' className={styles.mt_8} >{error['quantity']}</Text>}
    </div>
  );
});

export default CartCard;
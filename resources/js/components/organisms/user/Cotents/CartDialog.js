import React, { memo, useState } from 'react';
import { useTranslation } from "react-i18next";
import styles from './styles.module.css';
import CartBtn from '../../../molecules/IconBtn/CartBtn';
import CartModal from '../modal/CartModal';

const CartDialog = memo(({ isUserLogin, item, sizes, createData, className, ...props }) => {

  const [popup, setPopup] = useState(false);
  const { t } = useTranslation();

  return (
    <div className={className} {...props}>
      <CartBtn
        size='l'
        onClick={() => setPopup(true)}
        className={styles.mb_16}
        disabled={!isUserLogin}
      >
        {t('user.item.cart-btn')}
      </CartBtn>
      {popup === true &&
        <CartModal
          item={item}
          sizes={sizes}
          createData={createData}
          closeMethod={() => setPopup(false)}
        />
      }
    </div >
  );
});

export default CartDialog;
import React, { memo, useState } from 'react';
import Text from '../../../atoms/Text/Text';
import Mask from '../../../atoms/Mask/Mask';
import Image from '../../../atoms/Image/Image';
import Button from '../../../atoms/Button/Button';
import styles from './styles.module.css';
import CartBtn from '../../../molecules/IconBtn/CartBtn';
import CompletePopup from '../../../molecules/Popup/CompletePopup';
import { useTranslation } from 'react-i18next';
import { CONST } from '../../../constants/constants';

const CartModal = memo(({
  item,
  sizes,
  closeMethod,
  createData,
  ...props
}) => {

  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <Mask>
      {!isOpen ? (
        <div className={[styles.container, styles.max_width].join(' ')}>
          {item.skus.map((sku, index) =>
            <div key={index} className={styles.mb_24} >
              <div className={styles.img_area}>
                <Image
                  src={sku.img ? sku.img : '/img/no_image.png'}
                  alt="item image"
                  style={{ 'width': '50px', 'marginRight': '8px' }}
                />
                <Text>{sku.color_name}</Text>
              </div>
              <ul>
                {sku.sizes.map((sku_item, index) =>
                  <li key={index} className={styles.stock_area}>
                    <span>
                      {sizes.filter((size) => size.id == sku_item.size_id).map(el => (
                        <Text tag='span' key={el.id} className={styles.text_height}>{el.size_name} / </Text>
                      ))}
                      <Text tag='span' className={styles.text_height}>
                        {
                          sku_item.quantity > CONST.STOCK_PARAMETER.PLENTY ? `${t('user.item.quantity')}: 〇` :
                            sku_item.quantity > CONST.STOCK_PARAMETER.SLIGHT ? `${t('user.item.quantity')}: △` :
                              sku_item.quantity < CONST.STOCK_PARAMETER.SHORTAGE ? `${t('user.item.quantity')}: ☓` :
                                `${t('user.item.quantity')}: ー`
                        }
                      </Text>
                    </span>
                    <CartBtn
                      onClick={() => {
                        setIsOpen(true);
                        createData({
                          form: { sku_id: `${sku_item.id}` },
                          url: `/api/user/carts`,
                          callback: () => setTimeout(closeMethod, 1000)
                        });
                      }}
                      disabled={item.cart_items.includes(sku_item.id) || sku_item.quantity < 1}
                      className={styles.cart_btn_width}
                    >
                      {item.cart_items.includes(sku_item.id) ? t('user.cart.registered') : t('user.cart.register')}
                    </CartBtn>
                  </li>
                )}
              </ul>
            </div>
          )}
          <Button className={styles.close_btn} onClick={closeMethod} >{t('user.close-btn')}</Button>
        </div>
      ) : (
        <CompletePopup isOpen={true}>{t('user.cart.done')}</CompletePopup>
      )}
    </Mask>
  );
});

export default CartModal;

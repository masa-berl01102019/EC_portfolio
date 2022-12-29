import React, {memo, useState} from 'react';
import Text from '../../../atoms/Text/Text';
import Mask from '../../../atoms/Mask/Mask';
import Image from '../../../atoms/Image/Image';
import Button from '../../../atoms/Button/Button';
import styles from './styles.module.css';
import CartBtn from '../../../molecules/IconBtn/CartBtn';
import CompletePopup from '../../../molecules/Popup/CompletePopup';
import useI18next from '../../../context/I18nextContext';

const CartModal = ({
    item,
    sizes,
    closeMethod,
    createData,
    ...props
  }) => {

    const [isOpen, setIsOpen] = useState(false);
    const i18next = useI18next();

    return (
      <Mask>
      { !isOpen ? (
          <div className={[styles.container, styles.max_width].join(' ')}>
            { item.skus.map( (sku, index) => 
              <div key={index} className={styles.mb_24} >
                <div className={styles.img_area}>
                    <Image 
                        src={sku.img ? sku.img : '/img/no_image.png'} 
                        alt="item image" 
                        style={{'width' : '50px', 'marginRight': '8px'}} 
                    />
                    <Text>{sku.color_name}</Text>
                </div>
                <ul>
                  { sku.sizes.map((sku_item, index) => 
                    <li key={index} className={styles.stock_area}>
                        <span>
                            { sizes.filter((size) => size.id == sku_item.size_id).map(el => (
                                <Text tag='span' key={el.id} className={[styles.text_height, styles.mr_8].join(' ')}>{el.size_name}</Text>
                            ))}
                            <Text tag='span' className={styles.text_height}>{sku_item.quantity > 0 ? i18next.t('user.in-stock') : i18next.t('user.sold-out')}</Text>
                        </span>
                        <CartBtn 
                            onClick={() => {
                                setIsOpen(true);
                                createData({
                                    form: {sku_id: `${sku_item.id}`},
                                    url:`/api/user/carts`,
                                    callback: () => setTimeout(closeMethod, 1000)
                                });
                            }}
                            disabled={item.cart_items.includes(sku_item.id) || sku_item.quantity < 1}
                        >
                          {item.cart_items.includes(sku_item.id) ? i18next.t('user.cart.registered') : i18next.t('user.cart.register')}
                        </CartBtn>
                    </li>
                  )}
                </ul>
              </div>
            )}
            <Button className={styles.close_btn} onClick={closeMethod} >{i18next.t('user.close-btn')}</Button>
          </div>
      ) : (
        <CompletePopup isOpen={true}>{i18next.t('user.cart.done')}</CompletePopup>
      )}
      </Mask>
    );
};

export default CartModal;

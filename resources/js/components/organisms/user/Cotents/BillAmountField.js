import React, { memo } from 'react';
import { useTranslation } from "react-i18next";
import Text from '../../../atoms/Text/Text';
import { CONST } from '../../../constants/constants';
import styles from './styles.module.css';

const BillAmountField = memo(({
  total_amount,
  payment_method,
  className,
  ...props
}) => {

  const { t } = useTranslation();

  return (
    <fieldset className={[styles.field_area, className].join(' ')} {...props}>
      <legend>
        <Text role='title' className={styles.filed_title}>
          {t('user.cart.bill-amount')}
        </Text>
      </legend>
      <div className={styles.field_row}>
        <Text>{t('user.cart.subtotal-amount')}</Text>
        <Text>￥{total_amount ? Number(total_amount).toLocaleString() : ''}</Text>
      </div>
      <div className={styles.field_row}>
        <Text>{t('user.cart.postage')}</Text>
        <Text>￥{total_amount ? Number(0).toLocaleString() : ''}</Text>
      </div>
      <div className={styles.field_row}>
        <Text>{t('user.cart.commission-fee')}</Text>
        <Text>￥{total_amount ? Number(payment_method == CONST.PAYMENT_METHOD.CASH ? CONST.COMMISSION_FEE : 0).toLocaleString() : ''}</Text>
      </div>
      <div className={styles.field_row}>
        <Text>{t('user.cart.total-amount')}</Text>
        <Text>￥{total_amount ? Number(payment_method == CONST.PAYMENT_METHOD.CASH ? total_amount + CONST.COMMISSION_FEE : total_amount).toLocaleString() : ''}</Text>
      </div>
    </fieldset>
  );

});

export default BillAmountField;
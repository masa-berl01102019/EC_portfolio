import React, { memo } from 'react';
import { useTranslation } from "react-i18next";
import InputRadio from '../../../atoms/InputRadio/InputRadio';
import Text from '../../../atoms/Text/Text';
import { CONST } from '../../../constants/constants';
import styles from './styles.module.css';

const PaymentMethodField = memo(({
  formData,
  handleFormData,
  CardElement,
  isConfirmed,
  className,
  ...props
}) => {

  const { t } = useTranslation();

  return (
    <fieldset className={[styles.field_area, className].join(' ')} {...props}>
      <legend>
        <Text role='title' className={styles.filed_title}>
          {t('user.cart.payment-method')}
        </Text>
      </legend>
      {!isConfirmed ? (
        <label className={[styles.flex, styles.align_center].join(' ')}>
          <InputRadio
            name='payment_method'
            onChange={handleFormData}
            value={CONST.PAYMENT_METHOD.CREDIT_CARD}
            checked={formData?.payment_method == CONST.PAYMENT_METHOD.CREDIT_CARD}
          />
          <Text className={styles.ml_8}>{t('user.cart.payment-credit')}</Text>
        </label>
      ) : (
        <>
          <CardElement options={{ hidePostalCode: true }} />
          <Text role='error' className={styles.mt_8} style={{ 'lineHeight': '1.5' }}>
            TEST CARD NUMBER: 4242 4242 4242 4242
          </Text>
          <Text className={styles.mt_8} style={{ 'lineHeight': '1.5' }}>
            {t('user.cart.confirm.caution')}
          </Text>
        </>
      )}
    </fieldset>
  );

});

export default PaymentMethodField;

/* Another choice
  <label className={[styles.flex, styles.align_center].join(' ')}>
    <InputRadio
      name='payment_method'
      onChange={handleFormData}
      value={1}
      checked={formData.payment_method == 1}
    />
    <Text className={styles.ml_8}>代金引換</Text>
  </label>
  {formData.payment_method == 1 &&
    <div className={styles.mt_8}>
      <Text className={styles.mb_8}>※代金引換手数料は一律330円（税込）となります。</Text>
      <Text className={styles.mb_8}>※商品到着時に配達員に商品代金(税込)＋送料＋代金引換手数料をお支払いください。</Text>
      <Text>※代金引換は現金、クレジットカード、デビットカード、電子マネーがご利用いただけます。</Text>
    </div>
  } 
*/
import React, { memo } from 'react';
import { useTranslation } from "react-i18next";
import DatePicker from '../../../atoms/DatePicker/DatePicker';
import Selectbox from '../../../atoms/Selectbox/Selectbox';
import Text from '../../../atoms/Text/Text';
import styles from './styles.module.css';

const DeliveryDateField = memo(({
  formData,
  handleFormData,
  handleFormDate,
  delivery_date,
  delivery_time,
  isConfirmed,
  className,
  ...props
}) => {

  const { t } = useTranslation();

  return (
    <fieldset className={[styles.field_area, className].join(' ')} {...props}>
      <legend>
        <Text role='title' className={styles.filed_title}>
          {t('user.cart.delivery-date')}
        </Text>
      </legend>
      {!isConfirmed ? (
        <>
          <div className={styles.mb_8}>
            <label htmlFor='delivery_date' className={[styles.flex, styles.align_center].join(' ')}>
              <Text className={styles.mr_8}>{t('user.cart.preferred-delivery-day')}</Text>
              <DatePicker
                name={'delivery_date'}
                value={formData?.delivery_date}
                onChange={handleFormDate}
                style={{ 'width': '170px' }}
                openTo="date"
              />
            </label>
          </div>
          <label htmlFor='delivery_time' className={[styles.flex, styles.align_center].join(' ')}>
            <Text className={styles.mr_8}>{t('user.cart.preferred-delivery-time')}</Text>
            <Selectbox
              name="delivery_time"
              value={formData?.delivery_time}
              onChange={handleFormData}
              className={styles.w_170p}
            >
              <option value={''}>{t('user.not-set')}</option>
              <option value={'8:00 - 12:00'}>8:00 - 12:00</option>
              <option value={'14:00 - 16:00'}>14:00 - 16:00</option>
              <option value={'16:00 - 18:00'}>16:00 - 18:00</option>
              <option value={'18:00 - 20:00'}>18:00 - 20:00</option>
            </Selectbox>
          </label>
        </>
      ) : (
        <>
          <Text className={styles.mb_8}>
            {t('user.cart.preferred-delivery-day')}　{delivery_date}
          </Text>
          <Text>
            {t('user.cart.preferred-delivery-time')}　{delivery_time}
          </Text>
        </>
      )}
    </fieldset>
  );

});

export default DeliveryDateField;
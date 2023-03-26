import React, { memo } from 'react';
import { useTranslation } from "react-i18next";
import Icon from '../../../atoms/Icon/Icon';
import Text from '../../../atoms/Text/Text';
import styles from './styles.module.css';

const CartStep = memo(({ step, className, ...props }) => {

  const { t } = useTranslation();

  return (
    <div className={[styles.flex, styles.center, className].join(' ')} {...props}>
      <Text role='title'>{t('user.cart.progress-input')}</Text>
      <Icon
        src={step == 1 ? '/img/arrow_right_fill_disabled_icon.svg' : '/img/arrow_right_fill_icon.svg'}
        alt="direction icon"
        style={{ 'margin': '0 8px' }}
      />
      <Text role='title' className={step == 1 ? styles.disable : ''}>{t('user.cart.progress-confirm')}</Text>
      <Icon
        src={step == 1 || step == 2 ? '/img/arrow_right_fill_disabled_icon.svg' : '/img/arrow_right_fill_icon.svg'}
        alt="direction icon"
        style={{ 'margin': '0 8px' }}
      />
      <Text role='title' className={step == 1 || step == 2 ? styles.disable : ''}>{t('user.cart.progress-complete')}</Text>
    </div>
  );

});

export default CartStep;
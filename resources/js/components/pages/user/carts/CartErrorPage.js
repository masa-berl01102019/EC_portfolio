import React, { Suspense } from 'react';
import styles from '../styles.module.css';
import Text from '../../../atoms/Text/Text';
import Heading from '../../../atoms/Heading/Heading';
import LinkBtn from '../../../atoms/LinkButton/LinkBtn';
import { useTranslation } from 'react-i18next';
import { CircularProgress } from '@material-ui/core';

function CartErrorPage() {

  const { t } = useTranslation();

  return (
    <main className={styles.mt_40}>
      <Suspense fallback={<CircularProgress disableShrink />}>
        <Heading tag={'h1'} tag_style={'h1'} className={styles.section_title}>
          {t('user.cart.error.title')}
        </Heading>
        <div className={styles.form_contents_area}>
          <Text className={[styles.mb_4, styles.text_center].join(' ')}>
            {t('user.cart.error.p1')}
          </Text>
          <Text className={[styles.mb_32, styles.text_center].join(' ')}>
            {t('user.cart.error.p2')}
          </Text>
          <LinkBtn size='l' to={'/carts'} className={[styles.btn_max, styles.mr_auto, styles.ml_auto].join(' ')} >
            {t('user.cart.error.btn')}
          </LinkBtn>
        </div>
      </Suspense>
    </main>
  );
}

export default CartErrorPage;
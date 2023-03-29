import React, { Suspense } from 'react';
import styles from '../styles.module.css';
import Text from '../../../atoms/Text/Text';
import Heading from '../../../atoms/Heading/Heading';
import LinkBtn from '../../../atoms/LinkButton/LinkBtn';
import { useTranslation } from 'react-i18next';
import { CircularProgress } from '@material-ui/core';

function UserEditCompletePage() {

  const { t } = useTranslation();

  return (
    <main className={styles.mt_40}>
      <Suspense fallback={<CircularProgress disableShrink />}>
        <Heading tag={'h1'} tag_style={'h1'} className={styles.section_title}>
          {t('user.user.edit.title')}
        </Heading>
        <div className={styles.form_contents_area}>
          <Text className={[styles.mb_32, styles.paragraph].join(' ')}>
            {t('user.user.edit.p1')}<br />
            {t('user.user.edit.p2')}
          </Text>
          <LinkBtn size='l' to={'/'} className={[styles.btn_max, styles.mr_auto, styles.ml_auto].join(' ')}>
            {t('user.top-btn')}
          </LinkBtn>
        </div>
      </Suspense>
    </main>
  );
}

export default UserEditCompletePage;
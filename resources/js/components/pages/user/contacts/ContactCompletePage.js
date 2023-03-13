import React from 'react';
import styles from '../styles.module.css';
import Text from '../../../atoms/Text/Text';
import Heading from '../../../atoms/Heading/Heading';
import LinkBtn from '../../../atoms/LinkButton/LinkBtn';
import { useTranslation } from 'react-i18next';

function ContactCompletePage() {

  const { t } = useTranslation();

  return (
    <main className={styles.mt_40}>
      <Heading tag={'h1'} tag_style={'h1'} className={styles.section_title}>
        {t('user.contact.complete.title')}
      </Heading>
      <div className={styles.form_contents_area}>
        <Text className={[styles.mb_32, styles.paragraph].join(' ')}>
          {t('user.contact.complete.p1')}<br />
          {t('user.contact.complete.p2')}<br />
          {t('user.contact.complete.p3')}<br />
          {t('user.contact.complete.p4')}<br />
          {t('user.contact.complete.p5')}<br />
        </Text>
        <LinkBtn size='l' to={'/'} className={[styles.btn_max, styles.mr_auto, styles.ml_auto].join(' ')}>
          {t('user.top-btn')}
        </LinkBtn>
      </div>
    </main>
  );
}

export default ContactCompletePage;
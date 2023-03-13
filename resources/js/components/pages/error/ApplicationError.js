import React from 'react';
import Heading from '../../atoms/Heading/Heading';
import Text from '../../atoms/Text/Text';
import styles from './styles.module.css';
import { useTranslation } from 'react-i18next';

function ApplicationError() {

  const { t } = useTranslation();

  return (
    <div className={styles.general_error}>
      <Heading tag='h1' tag_style='h1' className={styles.mb_32}>
        {t('error.general.title')}
      </Heading>
      <Text size='l' className={styles.mb_24}>
        {t('error.general.message')}
      </Text>
      <Text size='l' className={styles.mb_24}>
        {t('error.general.reload')}
      </Text>
      <Text size='l' className={styles.mb_24}>
        {t('error.general.contact')}
      </Text>
      <Text size='l'>
        {t('error.general.contact2')}support_team@example.com
      </Text>
    </div>
  );
}

export default ApplicationError;

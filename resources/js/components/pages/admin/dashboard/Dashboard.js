import React from 'react';
import Text from '../../../atoms/Text/Text';
import Heading from '../../../atoms/Heading/Heading';
import styles from '../styles.module.css';
import { useTranslation } from 'react-i18next';

// TODO: Create dashboard page

function Dashboard() {

  const { t } = useTranslation();

  return (
    <main>
      <div className={styles.container}>
        <Heading tag={'h1'} tag_style={'h1'} className={styles.mb_16}>{t('admin.dashboard.title')}</Heading>
        <Text>{t('admin.dashboard.description')}</Text>
      </div>
    </main>
  );
}

export default Dashboard;

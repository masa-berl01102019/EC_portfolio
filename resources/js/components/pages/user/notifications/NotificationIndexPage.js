import React, { Suspense } from 'react';
import { CircularProgress } from '@material-ui/core';
import useFetchApiData from '../../../hooks/useFetchApiData';
import Heading from '../../../atoms/Heading/Heading';
import styles from '../styles.module.css';
import NotificationList from '../../../organisms/user/NotificationList/NotificationList';
import { useTranslation } from 'react-i18next';
import Text from '../../../atoms/Text/Text';

function NotificationIndexPage() {

  const baseUrl = `/api/user/notifications`;
  const model = 'NOTIFICATION';
  const { data, errorMessage } = useFetchApiData(baseUrl, model);
  const notifications = data.data ? data.data : null;
  const { t } = useTranslation();

  return (
    <main className={styles.mt_40}>
      <Suspense fallback={<CircularProgress disableShrink />}>
        <Heading tag={'h1'} tag_style={'h1'} className={styles.section_title}>
          {t('user.notification.index-title')}
        </Heading>
        <div className={styles.main_contents_area}>
          {notifications.length > 0 ? (
            notifications.map((notification) =>
              <NotificationList
                key={notification.id}
                notification={notification}
              />
            )
          ) : (
            <Text size='l' className={styles.not_found_msg}>
              {t('user.not-found')}
            </Text>
          )}
        </div>
      </Suspense>
    </main>
  );
}

export default NotificationIndexPage;
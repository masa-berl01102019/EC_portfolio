import React, { Suspense } from 'react';
import { CircularProgress } from '@material-ui/core';
import useFetchApiData from '../../../hooks/useFetchApiData';
import Heading from '../../../atoms/Heading/Heading';
import styles from '../styles.module.css';
import { useTranslation } from 'react-i18next';
import Text from '../../../atoms/Text/Text';
import { useLocation } from "react-router-dom";
import Notification from '../../../organisms/user/Cotents/Notification';

function NotificationIndexPage() {

  const baseUrl = `/api/user/notifications`;
  const model = 'NOTIFICATION';
  const { data, errorMessage } = useFetchApiData(baseUrl, model);
  const notifications = data.data ? data.data : null;
  const { t } = useTranslation();
  const location = useLocation();
  const state = location.state;

  return (
    <main className={styles.mt_40}>
      <Suspense fallback={<CircularProgress disableShrink />}>
        <Heading tag={'h1'} tag_style={'h1'} className={styles.section_title}>
          {t('user.notification.index-title')}
        </Heading>
        <div className={styles.main_contents_area}>
          {notifications.length > 0 ? (
            notifications.map((notification) =>
              <Notification
                key={notification.id}
                notification={notification}
                openId={state?.id}
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
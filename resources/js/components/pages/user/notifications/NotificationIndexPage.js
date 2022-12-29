import React, {Suspense} from 'react';
import {CircularProgress} from '@material-ui/core';
import useFetchApiData from '../../../hooks/useFetchApiData';
import Heading from '../../../atoms/Heading/Heading';
import styles from '../styles.module.css';
import NotificationList from '../../../molecules/NotificationList/NotificationList';
import useI18next from '../../../context/I18nextContext';

function NotificationIndexPage() {

    const baseUrl = `/api/user/notifications`;
    const model = 'NOTIFICATION';
    const {data, errorMessage} = useFetchApiData(baseUrl, model);
    const notifications = data.data? data.data: null;
    const i18next = useI18next();

    return (
        <main className={styles.mt_40}>
            <Suspense fallback={<CircularProgress disableShrink />}>
                <Heading tag={'h1'} tag_style={'h1'} className={styles.section_title}>{i18next.t('user.notification.index-title')}</Heading>
                <div className={styles.main_contents_area}>
                    {   notifications &&
                        notifications.map((notification) =>
                            <NotificationList
                                key={notification.id}
                                notification={notification}
                            />
                        )
                    }
                </div>
            </Suspense>
        </main>
    );
}

export default NotificationIndexPage;




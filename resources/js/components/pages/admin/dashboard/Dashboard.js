import React from 'react';
import Text from '../../../atoms/Text/Text';
import Heading from '../../../atoms/Heading/Heading';
import styles from '../styles.module.css';
import useI18next from '../../../context/I18nextContext';

function Dashboard() {

    const i18next = useI18next();

    return (
        <main>
            <div className={styles.container}>
                <Heading tag={'h1'} tag_style={'h1'} className={styles.mb_16}>{i18next.t('admin.dashboard.title')}</Heading>
                <Text>{i18next.t('admin.dashboard.description')}</Text>
            </div>
        </main>
    );
}

export default Dashboard;

import React from 'react';
import Heading from '../../atoms/Heading/Heading';
import Text from '../../atoms/Text/Text';
import styles from './styles.module.css';
import { useTranslation } from 'react-i18next';

function NotFound() {

    const { t } = useTranslation();

    return (
        <main className={styles.mt_40}>
            <Heading tag='h1' tag_style='h1' className={styles.section_title}>{t('error.404.status')}</Heading>
            <Text size='l' role='title' className={styles.text_center}>{t('error.404.message')}</Text>
        </main>
    );
}

export default NotFound;

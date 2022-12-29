import React from 'react';
import Heading from '../../atoms/Heading/Heading';
import Text from '../../atoms/Text/Text';
import styles from './styles.module.css';
import useI18next from '../../context/I18nextContext';

function NotFound() {

    const i18next = useI18next();

    return (
        <main className={styles.mt_40}>
            <Heading tag='h1' tag_style='h1' className={styles.section_title}>{i18next.t('error.not-found-status')}</Heading>
            <Text size='l' role='title' className={styles.text_center}>{i18next.t('error.not-found-msg')}</Text>
        </main>
    );
}

export default NotFound;

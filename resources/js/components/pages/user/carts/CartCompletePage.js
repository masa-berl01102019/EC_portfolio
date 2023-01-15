import React from 'react';
import styles from '../styles.module.css';
import Text from '../../../atoms/Text/Text';
import Heading from '../../../atoms/Heading/Heading';
import LinkBtn from '../../../atoms/LinkButton/LinkBtn';
import { useTranslation } from 'react-i18next';

function CartCompletePage() {

    const { t } = useTranslation();

    return (
        <main className={styles.mt_40}>
            <Heading tag={'h1'} tag_style={'h1'} className={styles.section_title}>{t('user.cart.complete.title')}</Heading>
            <div className={[styles.flex, styles.justify_center, styles.mb_32].join(' ')}>
                <Text role='title'>{t('user.cart.progress-input')}</Text>
                <Text role='title' className={styles.mrl_8}>▶</Text>
                <Text role='title'>{t('user.cart.progress-confirm')}</Text>
                <Text role='title' className={styles.mrl_8}>▶</Text>
                <Text role='title'>{t('user.cart.progress-complete')}</Text>
            </div>
            <div className={styles.form_contents_area}>
                <Text className={[styles.mb_32, styles.paragraph].join(' ')}>
                    {t('user.cart.complete.p1')}<br/>
                    {t('user.cart.complete.p2')}<br/>
                    {t('user.cart.complete.p3')}<br/>
                    {t('user.cart.complete.p4')}
                </Text>
                <LinkBtn size='l' to={'/'} className={[styles.btn_max, styles.mr_auto, styles.ml_auto].join(' ')}>{t('user.top-btn')}</LinkBtn>
            </div>
        </main>
    );
}

export default CartCompletePage;




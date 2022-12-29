import React from 'react';
import styles from '../styles.module.css';
import Text from '../../../atoms/Text/Text';
import Heading from '../../../atoms/Heading/Heading';
import LinkBtn from '../../../atoms/LinkButton/LinkBtn';
import useI18next from '../../../context/I18nextContext';

function CartErrorPage() {

    const i18next = useI18next();

    return (
        <main className={styles.mt_40}>
            <Heading tag={'h1'} tag_style={'h1'} className={styles.section_title}>{i18next.t('user.cart.error.title')}</Heading>
            <div className={styles.form_contents_area}>
                <Text className={[styles.mb_4, styles.text_center].join(' ')}>{i18next.t('user.cart.error.p1')}</Text>
                <Text className={[styles.mb_32, styles.text_center].join(' ')}>{i18next.t('user.cart.error.p2')}</Text>
                <LinkBtn size='l' to={'/carts'} className={[styles.btn_max, styles.mr_auto, styles.ml_auto].join(' ')} >{i18next.t('user.cart.error.btn')}</LinkBtn>
            </div>
        </main>
    );
}

export default CartErrorPage;
import React from 'react';
import styles from '../styles.module.css';
import Text from '../../../atoms/Text/Text';
import Heading from '../../../atoms/Heading/Heading';
import LinkBtn from '../../../atoms/LinkButton/LinkBtn';
import useI18next from '../../../context/I18nextContext';

function UserEditCompletePage() {

    const i18next = useI18next();

    return (
        <main className={styles.mt_40}>
            <Heading tag={'h1'} tag_style={'h1'} className={styles.section_title}>{i18next.t('user.user.edit.title')}</Heading>
            <div className={styles.form_contents_area}>
                <Text className={[styles.mb_32, styles.paragraph].join(' ')}>
                    {i18next.t('user.user.edit.p1')}<br/>
                    {i18next.t('user.user.edit.p2')}
                </Text>
                <LinkBtn size='l' to={'/'} className={[styles.btn_max, styles.mr_auto, styles.ml_auto].join(' ')}>{i18next.t('user.top-btn')}</LinkBtn>
            </div>
        </main>
    );
}

export default UserEditCompletePage;




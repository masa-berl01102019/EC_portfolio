import React from 'react';
import styles from '../styles.module.css';
import Text from '../../../atoms/Text/Text';
import Heading from '../../../atoms/Heading/Heading';
import LinkBtn from '../../../atoms/LinkButton/LinkBtn';

function UserEditCompletePage() {
    return (
        <main className={styles.mt_40}>
            <Heading tag={'h1'} tag_style={'h1'} className={styles.section_title}>会員情報の編集完了</Heading>
            <div className={styles.form_contents_area}>
                <Text className={[styles.mb_32, styles.paragraph].join(' ')}>
                    当社のサービスをご利用頂き、誠に有難う御座います。<br/>
                    会員情報の編集を承りましたことをお知らせ致します。
                </Text>
                <LinkBtn size='l' to={'/'} className={[styles.btn_max, styles.mr_auto, styles.ml_auto].join(' ')}>TOPページに戻る</LinkBtn>
            </div>
        </main>
    );
}

export default UserEditCompletePage;




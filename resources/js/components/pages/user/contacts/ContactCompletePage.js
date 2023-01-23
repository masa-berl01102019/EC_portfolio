import React from 'react';
import styles from '../styles.module.css';
import Text from '../../../atoms/Text/Text';
import Heading from '../../../atoms/Heading/Heading';
import LinkBtn from '../../../atoms/LinkButton/LinkBtn';

function ContactCompletePage() {
    return (
        <main className={styles.mt_40}>
            <Heading tag={'h1'} tag_style={'h1'} className={styles.section_title}>お問い合わせ完了</Heading>
            <div className={styles.form_contents_area}>
                <Text className={[styles.mb_32, styles.paragraph].join(' ')}>
                    当社のサービスをご利用頂き、誠に有難う御座います。<br/>
                    お問い合わせを承りましたことをお知らせ致します。<br/>
                    お問い合わせ頂いた内容につきましては、担当者より<br/>
                    ご登録のメールアドレス宛てにご連絡致します。<br/>
                    返信には数日かかる場合が御座います。<br/>
                    予めご了承のほど、何卒宜しくお願い申し上げます。<br/>
                </Text>
                <LinkBtn size='l' to={'/'} className={[styles.btn_max, styles.mr_auto, styles.ml_auto].join(' ')}>TOPページに戻る</LinkBtn>
            </div>
        </main>
    );
}

export default ContactCompletePage;




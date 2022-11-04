import React from 'react';
import styles from '../styles.module.css';
import Text from '../../../atoms/Text/Text';
import Heading from '../../../atoms/Heading/Heading';
import LinkBtn from '../../../atoms/LinkButton/LinkBtn';

function CartCompletePage() {
    return (
        <main className={styles.mt_40}>
            <Heading tag={'h1'} tag_style={'h1'} className={styles.section_title}>注文完了</Heading>
            <div className={[styles.flex, styles.justify_center, styles.mb_32].join(' ')}>
                <Text role='title'>注文情報入力</Text>
                <Text role='title' className={styles.mrl_8}>▶</Text>
                <Text role='title'>注文内容確認</Text>
                <Text role='title' className={styles.mrl_8}>▶</Text>
                <Text role='title'>注文完了</Text>
            </div>
            <div className={styles.form_contents_area}>
                <Text className={[styles.mb_4, styles.text_center].join(' ')}>商品の決済が完了致しました</Text>
                <Text className={[styles.mb_4, styles.text_center].join(' ')}>注文明細はご登録されている</Text>
                <Text className={[styles.mb_32, styles.text_center].join(' ')}>メールアドレスにお送り致します。</Text>
                <LinkBtn size='l' to={'/'} className={[styles.btn_max, styles.mr_auto, styles.ml_auto].join(' ')}>TOPページに戻る</LinkBtn>
            </div>
        </main>
    );
}

export default CartCompletePage;




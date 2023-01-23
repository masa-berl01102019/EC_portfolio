import React from 'react';
import styles from '../styles.module.css';
import Text from '../../../atoms/Text/Text';
import Heading from '../../../atoms/Heading/Heading';
import LinkBtn from '../../../atoms/LinkButton/LinkBtn';

function CartErrorPage() {
    return (
        <main className={styles.mt_40}>
            <Heading tag={'h1'} tag_style={'h1'} className={styles.section_title}>注文に失敗しました。</Heading>
            <div className={styles.form_contents_area}>
                <Text className={[styles.mb_4, styles.text_center].join(' ')}>何かしらの理由で決済が失敗しました。</Text>
                <Text className={[styles.mb_32, styles.text_center].join(' ')}>注文情報入力画面からやり直して下さい。</Text>
                <LinkBtn size='l' to={'/carts'} className={[styles.btn_max, styles.mr_auto, styles.ml_auto].join(' ')} >注文情報入力画面に戻る</LinkBtn>
            </div>
        </main>
    );
}

export default CartErrorPage;
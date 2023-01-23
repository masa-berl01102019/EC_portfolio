import React, {Suspense, useState} from 'react';
import {useLocation, useHistory} from 'react-router-dom';
import {CircularProgress} from '@material-ui/core';
import useFetchApiData from "../../../hooks/useFetchApiData";
import {CardElement, useStripe, useElements} from '@stripe/react-stripe-js';
import styles from '../styles.module.css';
import Text from '../../../atoms/Text/Text';
import Heading from '../../../atoms/Heading/Heading';
import Button from '../../../atoms/Button/Button';
import LinkBtn from '../../../atoms/LinkButton/LinkBtn';
import LoadingPopup from '../../../molecules/Popup/LoadingPopup';

function CartConfirmPage() {
    // urlの設定
    const baseUrl = `/api/user/carts`;
    // paramsの適用範囲を決めるscope名を定義
    const model = 'CART';
    // APIと接続して返り値を取得
    const {data, errorMessage, createData} = useFetchApiData(baseUrl, model);
    // APIから取得したデータを変数に格納
    const user = data.user? data.user: null;
    // 入力値を取得
    const {state} = useLocation();
    // 各stripeの要素を呼び出し
    const stripe = useStripe();
    const elements = useElements();
    // リダイレクト用の関数呼び出し
    const history = useHistory();
    // ローディングステータスの状態管理
    const [isLoading, setIsLoading] = useState(false);

    // フォーム送信
    const handleSubmit = async () => {
        if (elements == null) return;
        // ローディングスタート
        setIsLoading(true);
        // 非同期の関数を宣言してるのでawaitをつけてstripeに情報を送信する
        const {error, paymentMethod} = await stripe.createPaymentMethod({
            type: 'card',
            // 要素からクレジットカードの入力情報を取得
            card: elements.getElement(CardElement),
        });
        if(!error) {
            const { id } = paymentMethod;
            createData({
                form: {...state, id}, 
                url: '/api/user/orders', 
                callback: () => history.push('/carts/complete')
            });
        } else {
            // 失敗ページ表示
            history.push('/carts/error');
        }
    };

    return (
        <main className={styles.mt_40}>
            <Suspense fallback={<CircularProgress disableShrink />}>
                { isLoading && !errorMessage && <LoadingPopup isOpen={isLoading}>決済データ送信中</LoadingPopup> }
                <Heading tag={'h1'} tag_style={'h1'} className={styles.section_title}>注文内容確認</Heading>
                <div className={[styles.flex, styles.justify_center, styles.mb_32].join(' ')}>
                    <Text role='title'>注文情報入力</Text>
                    <Text role='title' className={styles.mrl_8}>▶</Text>
                    <Text role='title'>注文内容確認</Text>
                    <Text className={[styles.mrl_8, styles.disable].join(' ')}>▶</Text>
                    <Text className={styles.disable}>注文完了</Text>
                </div>
                <div className={styles.form_contents_area}>
                    {   errorMessage && !errorMessage.httpRequestError &&
                        <div className={styles.mb_24}>
                            <Text role='error'>注文情報入力画面の入力内容に誤りがあります。</Text> 
                            { errorMessage.payment_method && <Text role='error' className={styles.mt_8}>・{errorMessage.payment_method}</Text> }
                            { errorMessage.total_amount && <Text role='error' className={styles.mt_8}>・{errorMessage.total_amount}</Text> }
                            { errorMessage.delivery_date && <Text role='error' className={styles.mt_8}>・{errorMessage.delivery_date}</Text> }
                            { errorMessage.delivery_time && <Text role='error' className={styles.mt_8}>・{errorMessage.delivery_time}</Text> }
                        </div>
                    }
                    <fieldset className={styles.field_area}>
                        <legend>
                            <Text role='title' className={[styles.bold, styles.mrl_8].join(' ')}>ご請求金額</Text>
                        </legend>
                        <div className={[styles.flex, styles.justify_between, styles.mb_8].join(' ')}>
                            <Text>商品合計(税込)</Text>
                            <Text>￥{state ? Number(state.total_amount).toLocaleString() : null}</Text>
                        </div>
                        <div className={[styles.flex, styles.justify_between, styles.mb_8].join(' ')}>
                            <Text>送料</Text>
                            <Text>￥{state ? Number(0).toLocaleString() : ''}</Text>
                        </div>
                        <div className={[styles.flex, styles.justify_between, styles.mb_8].join(' ')}>
                            <Text>手数料</Text>
                            <Text>￥{state ? Number(state.payment_method == 1 ? 330 : 0).toLocaleString() : ''}</Text>
                        </div>
                        <div className={[styles.flex, styles.justify_between].join(' ')}>
                            <Text>合計金額(税込)</Text>
                            <Text>￥{state ? Number(state.payment_method == 1 ? state.total_amount + 330 : state.total_amount).toLocaleString() : null}</Text>
                        </div>
                    </fieldset>
                    <fieldset className={styles.field_area}>
                        <legend>
                            <Text role='title' className={[styles.bold, styles.mrl_8].join(' ')}>お届け先</Text>
                        </legend>
                        <Text className={styles.mb_8}>{user.delivery_post_code_text ? user.delivery_post_code_text : user.post_code_text}</Text>
                        <Text className={styles.mb_8}>{user.full_delivery_address ? user.full_delivery_address : user.full_address}</Text>
                        <Text className={styles.mb_8}>{user.tel}</Text>
                        <Text>{user.full_name}</Text>
                    </fieldset>
                    <fieldset className={styles.field_area}>
                        <legend>
                            <Text role='title' className={[styles.bold, styles.mrl_8].join(' ')}>配達日時</Text>
                        </legend>
                        <Text className={styles.mb_8}>配達ご希望日　{state?.delivery_date}</Text>
                        <Text>ご希望時間帯　{state?.delivery_time}</Text>
                    </fieldset>
                    <fieldset className={styles.field_area}>
                        <legend>
                            <Text role='title' className={[styles.bold, styles.mrl_8].join(' ')}>支払い方法</Text>
                        </legend>
                        <CardElement options={{ hidePostalCode: true }} />
                        <Text className={styles.mt_8} style={{'lineHeight' : '1.5'}}>※注文情報入力画面に戻られる場合、再度入力必要になります。</Text>
                    </fieldset>
                    <div className={styles.cart_btn_area}>
                        <Button 
                            size='l' 
                            color='primary' 
                            className={styles.mb_16} 
                            onClick={handleSubmit} 
                            disabled={!stripe}
                            style={{'width' : '100%'}}
                        >
                            決済する
                        </Button>
                        <LinkBtn size='l' to={'/carts'} style={{'width' : '100%'}}>注文情報入力ページに戻る</LinkBtn>
                    </div>
                </div>
            </Suspense>
        </main>
    );
}

export default CartConfirmPage;
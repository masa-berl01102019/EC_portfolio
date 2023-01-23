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
import { useTranslation } from 'react-i18next';

function CartConfirmPage() {

    const baseUrl = `/api/user/carts`;
    const model = 'CART';
    const {data, errorMessage, createData} = useFetchApiData(baseUrl, model);
    const user = data.user? data.user: null;
    const {state} = useLocation();
    const stripe = useStripe();
    const elements = useElements();
    const history = useHistory();
    const [isLoading, setIsLoading] = useState(false);
    const { t } = useTranslation();
    

    const handleSubmit = async () => {
        if (elements == null) return;
        // Start loading UI
        setIsLoading(true);
        // Send payment info to stripe
        const {error, paymentMethod} = await stripe.createPaymentMethod({
            type: 'card',
            // Get credit card info that user inputted on stripe element
            card: elements.getElement(CardElement),
        });
        if(!error) {
            const { id } = paymentMethod;
            createData({
                form: {...state, payment_token: id}, 
                url: '/api/user/orders', 
                callback: () => history.push('/carts/complete')
            });
        } else {
            history.push('/carts/error');
        }
    };

    return (
        <main className={styles.mt_40}>
            <Suspense fallback={<CircularProgress disableShrink />}>
                { isLoading && !errorMessage && <LoadingPopup isOpen={isLoading}>{t('user.cart.confirm.loading-msg')}</LoadingPopup> }
                <Heading tag={'h1'} tag_style={'h1'} className={styles.section_title}>{t('user.cart.confirm.title')}</Heading>
                <div className={[styles.flex, styles.justify_center, styles.mb_32].join(' ')}>
                    <Text role='title'>{t('user.cart.progress-input')}</Text>
                    <Text role='title' className={styles.mrl_8}>▶</Text>
                    <Text role='title'>{t('user.cart.progress-confirm')}</Text>
                    <Text className={[styles.mrl_8, styles.disable].join(' ')}>▶</Text>
                    <Text className={styles.disable}>{t('user.cart.progress-complete')}</Text>
                </div>
                <div className={styles.form_contents_area}>
                    {   errorMessage && !errorMessage.httpRequestError &&
                        <div className={styles.mb_24}>
                            <Text role='error'>{t('user.cart.confirm.error1')}</Text> 
                            { errorMessage.payment_token && <Text role='error' className={styles.mt_8}>・{errorMessage.payment_token}</Text> }
                            { errorMessage.total_amount && <Text role='error' className={styles.mt_8}>・{errorMessage.total_amount}</Text> }
                            { errorMessage.delivery_date && <Text role='error' className={styles.mt_8}>・{errorMessage.delivery_date}</Text> }
                            { errorMessage.delivery_time && <Text role='error' className={styles.mt_8}>・{errorMessage.delivery_time}</Text> }
                        </div>
                    }
                    <fieldset className={styles.field_area}>
                        <legend>
                            <Text role='title' className={[styles.bold, styles.mrl_8].join(' ')}>{t('user.cart.bill-amount')}</Text>
                        </legend>
                        <div className={[styles.flex, styles.justify_between, styles.mb_8].join(' ')}>
                            <Text>{t('user.cart.subtotal-amount')}</Text>
                            <Text>￥{state ? Number(state.total_amount).toLocaleString() : null}</Text>
                        </div>
                        <div className={[styles.flex, styles.justify_between, styles.mb_8].join(' ')}>
                            <Text>{t('user.cart.postage')}</Text>
                            <Text>￥{state ? Number(0).toLocaleString() : ''}</Text>
                        </div>
                        <div className={[styles.flex, styles.justify_between, styles.mb_8].join(' ')}>
                            <Text>{t('user.cart.commission-fee')}</Text>
                            <Text>￥{state ? Number(state.payment_method == 1 ? 330 : 0).toLocaleString() : ''}</Text>
                        </div>
                        <div className={[styles.flex, styles.justify_between].join(' ')}>
                            <Text>{t('user.cart.total-amount')}</Text>
                            <Text>￥{state ? Number(state.payment_method == 1 ? state.total_amount + 330 : state.total_amount).toLocaleString() : null}</Text>
                        </div>
                    </fieldset>
                    <fieldset className={styles.field_area}>
                        <legend>
                            <Text role='title' className={[styles.bold, styles.mrl_8].join(' ')}>{t('user.cart.delivery-place')}</Text>
                        </legend>
                        <Text className={styles.mb_8}>{user.delivery_post_code_text ? user.delivery_post_code_text : user.post_code_text}</Text>
                        <Text className={styles.mb_8}>{user.full_delivery_address ? user.full_delivery_address : user.full_address}</Text>
                        <Text className={styles.mb_8}>{user.tel}</Text>
                        <Text>{user.full_name}</Text>
                    </fieldset>
                    <fieldset className={styles.field_area}>
                        <legend>
                            <Text role='title' className={[styles.bold, styles.mrl_8].join(' ')}>{t('user.cart.delivery-date')}</Text>
                        </legend>
                        <Text className={styles.mb_8}>{t('user.cart.preferred-delivery-day')}　{state?.delivery_date}</Text>
                        <Text>{t('user.cart.preferred-delivery-time')}　{state?.delivery_time}</Text>
                    </fieldset>
                    <fieldset className={styles.field_area}>
                        <legend>
                            <Text role='title' className={[styles.bold, styles.mrl_8].join(' ')}>{t('user.cart.payment-method')}</Text>
                        </legend>
                        <CardElement options={{ hidePostalCode: true }} />
                        <Text role='error' className={styles.mt_8} style={{'lineHeight' : '1.5'}}>TEST CARD NUMBER: 4242 4242 4242 4242</Text>
                        <Text className={styles.mt_8} style={{'lineHeight' : '1.5'}}>{t('user.cart.confirm.caution')}</Text>
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
                            {t('user.cart.confirm.go-btn')}
                        </Button>
                        <LinkBtn size='l' to={'/carts'} style={{'width' : '100%'}}>{t('user.cart.confirm.back-btn')}</LinkBtn>
                    </div>
                </div>
            </Suspense>
        </main>
    );
}

export default CartConfirmPage;
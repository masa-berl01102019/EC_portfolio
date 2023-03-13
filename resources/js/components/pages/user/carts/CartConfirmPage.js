import React, { Suspense, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useHistory } from 'react-router-dom';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { CircularProgress } from '@material-ui/core';
import useFetchApiData from "../../../hooks/useFetchApiData";
import Text from '../../../atoms/Text/Text';
import Button from '../../../atoms/Button/Button';
import Heading from '../../../atoms/Heading/Heading';
import LinkBtn from '../../../atoms/LinkButton/LinkBtn';
import LoadingPopup from '../../../molecules/Popup/LoadingPopup';
import CartStep from '../../../organisms/user/Cotents/CartStep';
import AddressField from '../../../organisms/user/Cotents/AddressField';
import BillAmountField from '../../../organisms/user/Cotents/BillAmountField';
import DeliveryDateField from '../../../organisms/user/Cotents/DeliveryDateField';
import PaymentMethodField from '../../../organisms/user/Cotents/PaymentMethodField';
import styles from '../styles.module.css';

function CartConfirmPage() {

  const baseUrl = `/api/user/carts`;
  const model = 'CART';
  const { data, errorMessage, createData } = useFetchApiData(baseUrl, model);
  const user = data.user ? data.user : null;
  const { state } = useLocation();
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
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      // Get credit card info that user inputted on stripe element
      card: elements.getElement(CardElement),
    });
    if (!error) {
      const { id } = paymentMethod;
      createData({
        form: { ...state, payment_token: id },
        url: '/api/user/orders',
        callback: () => history.push('/carts/complete')
      });
      errorMessage && setIsLoading(false);
    } else {
      history.push('/carts/error');
    }
  };

  return (
    <main className={styles.mt_40}>
      <Suspense fallback={<CircularProgress disableShrink />}>
        {isLoading && !errorMessage && <LoadingPopup isOpen={isLoading}>{t('user.cart.confirm.loading-msg')}</LoadingPopup>}
        <Heading tag={'h1'} tag_style={'h1'} className={styles.section_title}>{t('user.cart.confirm.title')}</Heading>
        <CartStep step={2} className={styles.mb_32} />
        <div className={styles.form_contents_area}>

          {errorMessage && !errorMessage.httpRequestError &&
            <div className={styles.mb_24}>
              <Text role='error'>{t('user.cart.confirm.error1')}</Text>
              {errorMessage.payment_token && <Text role='error' className={styles.mt_8}>・{errorMessage.payment_token}</Text>}
              {errorMessage.total_amount && <Text role='error' className={styles.mt_8}>・{errorMessage.total_amount}</Text>}
              {errorMessage.delivery_date && <Text role='error' className={styles.mt_8}>・{errorMessage.delivery_date}</Text>}
              {errorMessage.delivery_time && <Text role='error' className={styles.mt_8}>・{errorMessage.delivery_time}</Text>}
            </div>
          }
          <BillAmountField
            total_amount={state?.total_amount}
            payment_method={state?.payment_method}
          />
          <AddressField
            user={user}
            isConfirmed={true}
          />
          <DeliveryDateField
            delivery_date={state?.delivery_date}
            delivery_time={state?.delivery_time}
            isConfirmed={true}
          />
          <PaymentMethodField
            CardElement={CardElement}
            isConfirmed={true}
          />
          <div className={styles.cart_btn_area}>
            <Button
              size='l'
              color='primary'
              className={styles.mb_16}
              onClick={handleSubmit}
              disabled={!stripe}
              style={{ 'width': '100%' }}
            >
              {t('user.cart.confirm.go-btn')}
            </Button>
            <LinkBtn size='l' to={'/carts'} style={{ 'width': '100%' }}>
              {t('user.cart.confirm.back-btn')}
            </LinkBtn>
          </div>

        </div>
      </Suspense>
    </main>
  );
}

export default CartConfirmPage;
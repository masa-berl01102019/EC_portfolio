import React, { Suspense, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CircularProgress } from '@material-ui/core';
import useForm from "../../../hooks/useForm";
import useValidation from '../../../hooks/useValidation';
import useFetchApiData from "../../../hooks/useFetchApiData";
import Text from '../../../atoms/Text/Text';
import Button from '../../../atoms/Button/Button';
import Heading from '../../../atoms/Heading/Heading';
import LinkBtn from '../../../atoms/LinkButton/LinkBtn';
import CartCard from '../../../organisms/user/Card/CartCard';
import CartStep from '../../../organisms/user/Cotents/CartStep';
import AddressField from '../../../organisms/user/Cotents/AddressField';
import ValidationMsg from '../../../molecules/ErrorMessage/ValidationMsg'
import BillAmountField from '../../../organisms/user/Cotents/BillAmountField';
import DeliveryDateField from '../../../organisms/user/Cotents/DeliveryDateField';
import PaymentMethodField from '../../../organisms/user/Cotents/PaymentMethodField';
import styles from '../styles.module.css';
import { CONST } from '../../../constants/constants';

function CartIndexPage() {

  const baseUrl = `/api/user/carts`;
  const model = 'CART';
  const { data, errorMessage, updateData, deleteData } = useFetchApiData(baseUrl, model);
  const [formData, { setFormData, handleFormData, handleFormDate }] = useForm({
    'total_amount': 0,
    'payment_method': CONST.PAYMENT_METHOD.CREDIT_CARD, // * payment method is only credit card in first development phase.
    'delivery_date': null,
    'delivery_time': ''
  });
  const { valid, setValid, validation } = useValidation(formData, 'user', 'order_request');
  const { data: carts, user } = data;
  const amount = carts.length > 0 ? carts.map(item => item.included_tax_price * item.quantity).reduce((prev, next) => prev + next) : 0;
  const stock = carts.map(item => item.stock);
  const history = useHistory();
  const { t } = useTranslation();

  useEffect(() => {
    if (carts.length > 0) {
      setFormData({
        ...formData,
        'total_amount': amount
      });
    }
  }, [amount]);

  const handleClick = e => {
    e.preventDefault();
    if (validation.fails()) {
      setValid(true);
    } else {
      history.push('/carts/confirm', formData);
    }
  }

  return (
    <main className={styles.mt_40}>
      <Suspense fallback={<CircularProgress disableShrink />}>
        <Heading tag={'h1'} tag_style={'h1'} className={styles.section_title}>
          {t('user.cart.index.title')}
        </Heading>
        <CartStep step={1} className={styles.mb_32} />
        <div className={styles.form_contents_area}>

          {valid && validation.fails() &&
            <div className={[styles.mb_24, styles.w_100, styles.border_box, styles.front_validation].join(' ')}>
              <ValidationMsg errKey={'total_amount'} valid={valid} validation={validation} className={styles.override} />
              <ValidationMsg errKey={'payment_method'} valid={valid} validation={validation} className={styles.override} />
              <ValidationMsg errKey={'delivery_date'} valid={valid} validation={validation} className={styles.override} />
              <ValidationMsg errKey={'delivery_time'} valid={valid} validation={validation} className={styles.override} />
            </div>
          }

          <div className={[styles.flex, styles.justify_between, styles.mb_8].join(' ')}>
            <Text role='title' className={styles.bold}>{t('user.cart.shopping-cart')}</Text>
            <Text role='title' className={styles.bold}>{t('user.cart.list-num', { count: carts.length })}</Text>
          </div>

          <div className={styles.mb_32}>
            {carts && carts.map((cart) =>
              <CartCard
                key={cart.id}
                cart={cart}
                update_method={e => updateData({ form: { quantity: `${e.target.value}` }, url: `/api/user/carts/${cart.id}` })}
                delete_method={() => deleteData({ url: `/api/user/carts/${cart.id}` })}
                error={errorMessage}
              />
            )}
          </div>

          {stock.includes(0) &&
            <Text size='l' role='error' className={[styles.paragraph, styles.mb_32].join(' ')}>
              {t('user.cart.index.error1')}<br />
              {t('user.cart.index.error2')}<br />
              {t('user.cart.index.error3')}
            </Text>
          }

          {carts.length > 0 && !stock.includes(0) &&
            <>
              <AddressField
                user={user}
                isConfirmed={false}
              />
              <DeliveryDateField
                formData={formData}
                handleFormData={handleFormData}
                handleFormDate={handleFormDate}
                isConfirmed={false}
              />
              <PaymentMethodField
                formData={formData}
                handleFormData={handleFormData}
                isConfirmed={false}
              />
              <BillAmountField
                total_amount={formData.total_amount}
                payment_method={formData.payment_method}
              />
            </>
          }

          <div className={styles.cart_btn_area}>
            {carts.length > 0 && !stock.includes(0) &&
              <Button size='l' color='primary' className={styles.mb_16} style={{ 'width': '100%' }} onClick={handleClick}>
                {t('user.cart.index.go-btn')}
              </Button>
            }
            <LinkBtn size='l' to={'/'} style={{ 'width': '100%' }}>{t('user.cart.index.back-btn')}</LinkBtn>
          </div>

        </div>
      </Suspense>
    </main>
  );
}

export default CartIndexPage;
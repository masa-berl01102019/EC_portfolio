import React, {Suspense, useEffect} from 'react';
import {Link, useHistory} from 'react-router-dom';
import {CircularProgress} from '@material-ui/core';
import useFetchApiData from "../../../hooks/useFetchApiData";
import useForm from "../../../hooks/useForm";
import styles from '../styles.module.css';
import Text from '../../../atoms/Text/Text';
import Heading from '../../../atoms/Heading/Heading';
import CartCard from '../../../molecules/Card/CartCard';
import DatePicker from '../../../atoms/DatePicker/DatePicker';
import Selectbox from '../../../atoms/Selectbox/Selectbox';
import InputRadio from '../../../atoms/InputRadio/InputRadio';
import LinkBtn from '../../../atoms/LinkButton/LinkBtn';
import useValidation from '../../../hooks/useValidation';
import Button from '../../../atoms/Button/Button';
import { useTranslation } from 'react-i18next';

function CartIndexPage() {

    const baseUrl = `/api/user/carts`;
    const model = 'CART';
    const {data, errorMessage, updateData, deleteData} = useFetchApiData(baseUrl, model);
    const [formData, {setFormData, handleFormData, handleFormDate}] = useForm({
        'total_amount': 0,
        'payment_method': 0, // 0: クレジットカード 1: 代引き * 第一フェーズでの支払い方法はクレジットカードのみ
        'delivery_date': null,
        'delivery_time': ''
    });
    const {valid, setValid, validation} = useValidation(formData, 'user', 'order_request');
    const {data:carts, user} = data;
    const amount = carts.length > 0 ? carts.map(item => item.included_tax_price * item.quantity).reduce((prev,next) => prev + next) : 0;
    const stock = carts.map(item => item.stock);
    const history = useHistory();
    const { t } = useTranslation();

    useEffect(() => {
        if(carts.length > 0) {
            setFormData({
                ...formData,
                'total_amount': amount
            });
        }
    },[amount]);

    return (
        <main className={styles.mt_40}>
            <Suspense fallback={<CircularProgress disableShrink />}>
                <Heading tag={'h1'} tag_style={'h1'} className={styles.section_title}>{t('user.cart.index.title')}</Heading>
                <div className={[styles.flex, styles.justify_center, styles.mb_32].join(' ')}>
                    <Text role='title'>{t('user.cart.progress-input')}</Text>
                    <Text className={[styles.mrl_8, styles.disable].join(' ')}>▶</Text>
                    <Text className={styles.disable}>{t('user.cart.progress-confirm')}</Text>
                    <Text className={[styles.mrl_8, styles.disable].join(' ')}>▶</Text>
                    <Text className={styles.disable}>{t('user.cart.progress-complete')}</Text>
                </div>
                <div className={styles.form_contents_area}>
                    {   valid && validation.fails() && 
                        <div className={[styles.mb_24, styles.pa_16, styles.w_100, styles.border_box, styles.front_validation].join(' ')}>
                            {   validation.errors.first('total_amount') && 
                                <Text size='s' role='error' className={styles.paragraph}>
                                    {validation.errors.first('total_amount')}
                                </Text>
                            }
                            {   validation.errors.first('payment_method') && 
                                <Text size='s' role='error' className={styles.paragraph}>
                                    {validation.errors.first('payment_method')}
                                </Text>
                            }
                            {   validation.errors.first('delivery_date') && 
                                <Text size='s' role='error' className={styles.paragraph}>
                                    {validation.errors.first('delivery_date')}
                                </Text>
                            }
                            {   validation.errors.first('delivery_time') && 
                                <Text size='s' role='error' className={styles.paragraph}>
                                    {validation.errors.first('delivery_time')}
                                </Text>
                            }
                        </div>
                    }
                    <div className={[styles.flex, styles.justify_between, styles.mb_8].join(' ')}>
                        <Text role='title' className={styles.bold}>{t('user.cart.shopping-cart')}</Text>
                        <Text role='title' className={styles.bold}>{t('user.cart.list-num', {count: carts.length})}</Text>
                    </div>
                    <div className={styles.mb_32}>
                    {   carts &&
                        carts.map((cart) =>
                            <CartCard
                                key={cart.id}
                                src={cart.top_image}
                                to={`/items/${cart.item_id}`}
                                brand_name={cart.brand_name}
                                item_name={cart.item_name}
                                price={cart.included_tax_price}
                                price_text={cart.included_tax_price_text}
                                color_name={cart.color_name}
                                size_name={cart.size_name}
                                stock_status={cart.stock_status}
                                stock={cart.stock}
                                quantity={cart.quantity}
                                update_method={e => updateData({ form: {quantity: `${e.target.value}`}, url:`/api/user/carts/${cart.id}` })}
                                delete_method={() => deleteData({ url:`/api/user/carts/${cart.id}`})}
                                error={errorMessage}
                            />
                        )
                    }
                    </div>
                    { stock.includes(0) && 
                        <Text size='l' role='error' className={[styles.paragraph, styles.mb_32].join(' ')}>
                            {t('user.cart.index.error1')}<br/>
                            {t('user.cart.index.error2')}<br/>
                            {t('user.cart.index.error3')}
                        </Text>
                    }
                    {   carts.length > 0 && !stock.includes(0) &&
                        <>
                            <fieldset className={styles.field_area}>
                                <legend className={[styles.flex, styles.align_center, styles.prl_8].join(' ')}>
                                    <Text role='title' className={[styles.bold, styles.mr_4].join(' ')}>{t('user.cart.delivery-place')}</Text>
                                    <Text>(　</Text>
                                    <Link to={`/users/edit`}>{t('user.edit-link')}</Link>
                                    <Text>　)</Text>
                                </legend>
                                <Text className={styles.mb_8}>{user.delivery_post_code_text ? user.delivery_post_code_text : user.post_code_text}</Text>
                                <Text className={styles.mb_8}>{user.full_delivery_address ? user.full_delivery_address : user.full_address}</Text>
                                <Text className={styles.mb_8}>{user.tel}</Text>
                                <Text>{user.full_name}</Text>
                            </fieldset>
                            <fieldset className={styles.field_area}>
                                <legend><Text role='title' className={[styles.bold, styles.mrl_8].join(' ')}>{t('user.cart.delivery-date')}</Text></legend>
                                <div className={styles.mb_8}>
                                    <label htmlFor='delivery_date' className={[styles.flex, styles.align_center].join(' ')}>
                                        <Text className={styles.mr_8}>{t('user.cart.preferred-delivery-day')}</Text>
                                        <DatePicker 
                                            name={'delivery_date'} 
                                            value={formData.delivery_date} 
                                            onChange={handleFormDate}
                                            style={{'width': '170px'}}
                                            openTo="date"
                                        />
                                    </label>
                                </div>
                                <label htmlFor='delivery_time' className={[styles.flex, styles.align_center].join(' ')}>
                                    <Text className={styles.mr_8}>{t('user.cart.preferred-delivery-time')}</Text>
                                    <Selectbox 
                                        name="delivery_time" 
                                        value={formData.delivery_time} 
                                        onChange={handleFormData} 
                                        className={styles.w_170p}
                                    >
                                        <option value={''}>{t('user.not-set')}</option>
                                        <option value={'8:00 - 12:00'}>8:00 - 12:00</option>
                                        <option value={'14:00 - 16:00'}>14:00 - 16:00</option>
                                        <option value={'16:00 - 18:00'}>16:00 - 18:00</option>
                                        <option value={'18:00 - 20:00'}>18:00 - 20:00</option>
                                    </Selectbox>
                                </label>
                            </fieldset>
                            <fieldset className={styles.field_area}>
                                <legend>
                                    <Text role='title' className={[styles.bold, styles.mrl_8].join(' ')}>{t('user.cart.payment-method')}</Text>
                                </legend>
                                <label className={[styles.flex, styles.align_center].join(' ')}>
                                    <InputRadio 
                                        name='payment_method' 
                                        onChange={handleFormData}
                                        value={0} 
                                        checked={formData.payment_method == 0}
                                    />
                                    <Text className={styles.ml_8}>{t('user.cart.payment-credit')}</Text>
                                </label>
                                {/* <label className={[styles.flex, styles.align_center].join(' ')}>
                                    <InputRadio 
                                        name='payment_method' 
                                        onChange={handleFormData}
                                        value={1} 
                                        checked={formData.payment_method == 1}
                                    />
                                    <Text className={styles.ml_8}>代金引換</Text>
                                </label>
                                {   formData.payment_method == 1 &&
                                    <div className={styles.mt_8}>
                                        <Text className={styles.mb_8}>※代金引換手数料は一律330円（税込）となります。</Text>
                                        <Text className={styles.mb_8}>※商品到着時に配達員に商品代金(税込)＋送料＋代金引換手数料をお支払いください。</Text>
                                        <Text>※代金引換は現金、クレジットカード、デビットカード、電子マネーがご利用いただけます。</Text>
                                    </div>
                                }  */}
                            </fieldset>
                            <fieldset className={styles.field_area}>
                                <legend>
                                    <Text role='title' className={[styles.bold, styles.mrl_8].join(' ')}>{t('user.cart.bill-amount')}</Text>
                                </legend>
                                <div className={[styles.flex, styles.justify_between, styles.mb_8].join(' ')}>
                                    <Text>{t('user.cart.subtotal-amount')}</Text>
                                    <Text>￥{Number(formData.total_amount).toLocaleString()}</Text>
                                </div>
                                <div className={[styles.flex, styles.justify_between, styles.mb_8].join(' ')}>
                                    <Text>{t('user.cart.postage')}</Text>
                                    <Text>￥0</Text>
                                </div>
                                <div className={[styles.flex, styles.justify_between, styles.mb_8].join(' ')}>
                                    <Text>{t('user.cart.commission-fee')}</Text>
                                    <Text>￥{Number(formData.payment_method == 1 ? 330 : 0).toLocaleString()}</Text>
                                </div>
                                <div className={[styles.flex, styles.justify_between].join(' ')}>
                                    <Text>{t('user.cart.total-amount')}</Text>
                                    <Text>￥{Number(formData.payment_method == 1 ? formData.total_amount + 330 : formData.total_amount).toLocaleString()}</Text>
                                </div>
                            </fieldset>
                        </>
                    }
                    <div className={styles.cart_btn_area}>
                        {   carts.length > 0 && !stock.includes(0) &&
                            <Button size='l' color='primary' className={styles.mb_16} style={{'width' : '100%'}} onClick={e => {
                                e.preventDefault();
                                if(validation.fails()) {
                                    setValid(true);
                                } else {
                                    history.push('/carts/confirm', formData);
                                }
                            }}>
                                {t('user.cart.index.go-btn')}
                            </Button>
                        }
                        <LinkBtn size='l' to={'/'} style={{'width' : '100%'}}>{t('user.cart.index.back-btn')}</LinkBtn>
                    </div>
                </div>
            </Suspense>
        </main>
    );
}

export default CartIndexPage;
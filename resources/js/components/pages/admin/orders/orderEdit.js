import React, {Suspense} from 'react';
import {useHistory} from "react-router-dom";
import useFetchApiData from "../../../hooks/useFetchApiData";
import {CircularProgress} from "@material-ui/core";
import useForm from "../../../hooks/useForm";
import Heading from '../../../atoms/Heading/Heading';
import Button from '../../../atoms/Button/Button';
import FormSelectbox from '../../../molecules/Form/FormSelectbox';
import ItemOrderTable from '../../../organisms/admin/Table/ItemOrderTable';
import Text from '../../../atoms/Text/Text';
import styles from '../styles.module.css';
import LinkBtn from '../../../atoms/LinkButton/LinkBtn';
import { useRecoilValue } from 'recoil';
import { menuAdminState } from '../../../store/menuState';
import FormDatePicker from '../../../molecules/Form/FormDatePicker';
import useValidation from '../../../hooks/useValidation';
import { useTranslation } from 'react-i18next';

function OrderEdit(props) {

    const baseUrl = `/api/admin/orders/${props.match.params.id}/edit`;
    const model = 'ORDER';
    const {data, errorMessage, updateData} = useFetchApiData(baseUrl, model);
    const [formData, {handleFormData, handleFormDate}] = useForm(data.order);
    const history = useHistory();
    const openAdminMenu = useRecoilValue(menuAdminState);
    const {valid, setValid, validation, errorObject} = useValidation(formData, 'admin', 'order_edit');
    const { t } = useTranslation();

    return (
        <main>
            <Suspense fallback={<CircularProgress disableShrink />}>
                <div className={ openAdminMenu ? [styles.container_open_menu, styles.max_content].join(' ') : [styles.container, styles.max_content].join(' ') }>
                    <Heading tag={'h1'} tag_style={'h1'} className={styles.mb_16}>{t('admin.order.edit-title')}</Heading>
                    <div className={styles.form_area}>
                        <form onSubmit={ e => {
                            e.preventDefault();
                            if(validation.fails()) {
                                setValid(true);
                                return false;
                            }
                            updateData({
                                form: formData, 
                                url: `/api/admin/orders/${props.match.params.id}`,
                                callback: () => history.push('/admin/orders')
                            });
                        }}>
                            <div className={styles.mb_32}>
                                <div className={[styles.scroll_x, styles.mb_16].join(' ')}>
                                    <ItemOrderTable order={formData} />
                                </div>
                                <div>
                                    <div className={[styles.amount, styles.mb_4].join(' ')}>
                                        <Text>{t('admin.order.subtotal-amount')}</Text> <Text>{formData.sub_total_text}</Text>
                                    </div>
                                    <div className={[styles.amount, styles.mb_4].join(' ')}>
                                        <Text>{t('admin.order.tax-amount')}</Text> <Text>{formData.tax_amount_text}</Text>
                                    </div>
                                    <div className={[styles.amount, styles.amount_border].join(' ')}>
                                        <Text>{t('admin.order.total-amount')}</Text> <Text>{formData.total_amount_text}</Text>
                                    </div>
                                </div>
                            </div>
                            <div className={[styles.flex, styles.flex_sp].join(' ')}>
                                <FormDatePicker
                                    name={'delivery_date'} 
                                    value={formData.delivery_date} 
                                    onChange={handleFormDate} 
                                    label={t('admin.order.preferred-delivery-day')}
                                    className={[styles.mr_24, styles.mb_16].join(' ')}
                                    error={errorMessage}
                                    validation={validation}
                                    valid={valid}
                                    openTo="date"
                                />
                                <FormSelectbox
                                    name='delivery_time'
                                    value={formData.delivery_time}
                                    onChange={handleFormData}
                                    label={t('admin.order.preferred-delivery-time')}
                                    error={errorMessage}
                                    validation={validation}
                                    valid={valid}
                                    className={[styles.flex_grow, styles.mb_16].join(' ')}
                                >
                                    <option value={''}>{t('admin.not-set')}</option>
                                    <option value={'8:00 - 12:00'}>8:00 - 12:00</option>
                                    <option value={'14:00 - 16:00'}>14:00 - 16:00</option>
                                    <option value={'16:00 - 18:00'}>16:00 - 18:00</option>
                                    <option value={'18:00 - 20:00'}>18:00 - 20:00</option>
                                </FormSelectbox>
                            </div>

                            <div className={[styles.flex, styles.mb_40, styles.flex_sp].join(' ')}>
                                <FormSelectbox
                                    name='is_paid'
                                    value={formData.is_paid}
                                    onChange={handleFormData}
                                    label={t('admin.order.payment-status')}
                                    error={errorMessage}
                                    validation={validation}
                                    valid={valid}
                                    className={[styles.flex_basis_50, styles.mr_24, styles.mb_16].join(' ')}
                                >
                                    <option value={0}>{t('admin.order.not-paid')}</option>
                                    <option value={1}>{t('admin.order.paid')}</option>
                                </FormSelectbox>
                                <FormSelectbox
                                    name='is_shipped'
                                    value={formData.is_shipped}
                                    onChange={handleFormData}
                                    label={t('admin.order.delivery-status')}
                                    error={errorMessage}
                                    validation={validation}
                                    valid={valid}
                                    className={[styles.flex_basis_50, styles.mb_16].join(' ')}
                                >
                                    <option value={0}>{t('admin.order.not-delivered')}</option>
                                    <option value={1}>{t('admin.order.delivered')}</option>
                                </FormSelectbox>
                            </div>

                            <div className={[styles.flex, styles.justify_center].join(' ')}>
                                <LinkBtn to={`/admin/orders`} size='l' className={styles.mr_12} style={{'width': '100%'}}>{t('admin.back-btn')}</LinkBtn>
                                <Button size='l' color='primary' type="submit" className={[styles.ml_12, styles.w_100].join(' ')}>{t('admin.update')}</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </Suspense>
        </main>
    );
}

export default OrderEdit;

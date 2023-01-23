import React, {Suspense} from 'react';
import {useHistory} from "react-router-dom";
import useFetchApiData from "../../../hooks/useFetchApiData";
import {CircularProgress} from "@material-ui/core";
import useForm from "../../../hooks/useForm";
import FormInputText from '../../../molecules/Form/FormInputText';
import Button from '../../../atoms/Button/Button';
import Heading from '../../../atoms/Heading/Heading';
import FormSelectbox from '../../../molecules/Form/FormSelectbox';
import styles from '../styles.module.css';
import LinkBtn from '../../../atoms/LinkButton/LinkBtn';
import { useRecoilValue } from 'recoil';
import { menuAdminState } from '../../../store/menuState';
import FormInputTextarea from '../../../molecules/Form/FormInputTextarea';
import FormDatePicker from '../../../molecules/Form/FormDatePicker';
import useNotify from '../../../context/NotifyContext';
import useValidation from '../../../hooks/useValidation';
import { useTranslation } from 'react-i18next';


function NotificationEdit(props) {

    const baseUrl = `/api/admin/notifications/${props.match.params.id}/edit`;
    const model = 'NOTIFICATION';
    const {data, errorMessage, updateData} = useFetchApiData(baseUrl, model);
    const [formData, {handleFormData, handleFormDate}] = useForm(data.notification);
    const {valid, setValid, validation} = useValidation(formData, 'admin', 'notification_request');
    const history = useHistory();
    const openAdminMenu = useRecoilValue(menuAdminState);
    const confirm = useNotify();
    const { t } = useTranslation();

    const handleConfirmUpdate = async () => {
        const result = await confirm({
            body : t('admin.notification.confirm-msg'),
            confirmBtnLabel : t('admin.yes-btn')
        });
        result && updateData({
            form: formData, 
            url: `/api/admin/notifications/${props.match.params.id}`,
            callback: () => history.push('/admin/notifications') 
        });
    }
    
    return (
        <main>
            <Suspense fallback={<CircularProgress disableShrink />}>
                <div className={ openAdminMenu ? [styles.container_open_menu, styles.max_content].join(' ') : [styles.container, styles.max_content].join(' ') }>
                    <Heading tag={'h1'} tag_style={'h1'} className={styles.mb_16}>{t('admin.notification.edit-title')}</Heading>
                    <div className={styles.form_area}>
                        <form onSubmit={ e => {
                            e.preventDefault();
                            if(validation.fails()) {
                                setValid(true);
                            } else {
                                if(formData.is_published && formData.expired_at === null) {
                                    handleConfirmUpdate();
                                } else {
                                    updateData({
                                        form: formData, 
                                        url: `/api/admin/notifications/${props.match.params.id}`,
                                        callback: () => history.push('/admin/notifications') 
                                    });
                                }
                            }
                        }}>
                            <FormInputText
                                name={'title'}
                                onChange={handleFormData}
                                value={formData.title}
                                label={t('admin.notification.title')}
                                error={errorMessage}
                                validation={validation}
                                valid={valid}
                                placeholder={t('admin.notification.title-ex')}
                                className={styles.mb_16}
                            />
                            <FormInputTextarea
                                name={'body'} 
                                value={formData.body}
                                onChange={handleFormData} 
                                label={t('admin.notification.body')}
                                error={errorMessage}
                                validation={validation}
                                valid={valid}
                                placeholder={t('admin.notification.body-ex')}
                                className={styles.mb_16}
                                style={{'minHeight' : '250px'}}
                            />

                            <div className={[styles.flex, styles.mb_40, styles.flex_sp].join(' ')}>
                                <FormSelectbox
                                    name='is_published'
                                    value={formData.is_published}
                                    onChange={handleFormData}
                                    label={t('admin.set-published-status')}
                                    error={errorMessage}
                                    validation={validation}
                                    valid={valid}
                                    className={[styles.flex_grow, styles.mr_24, styles.mb_16_sp].join(' ')}
                                >
                                    <option value={0}>{t('admin.unpublished')}</option>
                                    <option value={1}>{t('admin.published')}</option>
                                </FormSelectbox>
                                <FormDatePicker
                                    name={'expired_at'} 
                                    value={formData.expired_at} 
                                    onChange={handleFormDate} 
                                    label={t('admin.notification.expired-date')}
                                    className={styles.mb_10} 
                                    error={errorMessage}
                                    validation={validation}
                                    valid={valid}
                                    openTo="date"
                                />
                            </div>
                            
                            <div className={[styles.flex, styles.justify_center].join(' ')}>
                                <LinkBtn to={`/admin/notifications`} size='l' className={styles.mr_12} style={{'width': '100%'}} >{t('admin.back-btn')}</LinkBtn>
                                <Button size='l' color='primary' type="submit" className={[styles.ml_12, styles.w_100].join(' ')}>{t('admin.update')}</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </Suspense>
        </main>
    );
}

export default NotificationEdit;

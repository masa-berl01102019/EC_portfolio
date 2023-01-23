import React, {Suspense} from 'react';
import {useHistory} from "react-router-dom";
import {CircularProgress} from "@material-ui/core";
import useFetchApiData from "../../../hooks/useFetchApiData";
import useForm from "../../../hooks/useForm";
import FormInputText from '../../../molecules/Form/FormInputText';
import Button from '../../../atoms/Button/Button';
import Heading from '../../../atoms/Heading/Heading';
import Text from '../../../atoms/Text/Text';
import styles from '../styles.module.css';
import LinkBtn from '../../../atoms/LinkButton/LinkBtn';
import { useRecoilValue } from 'recoil';
import { menuAdminState } from '../../../store/menuState';
import useValidation from '../../../hooks/useValidation';
import useI18next from '../../../context/I18nextContext';

function AdminCreate() {

    const baseUrl = '/api/admin/admins/create';
    const model = 'ADMIN';
    const {data, errorMessage, createData} = useFetchApiData(baseUrl, model);
    const [formData, {handleFormData}] = useForm({
        'last_name': null,
        'first_name': null,
        'last_name_kana': null,
        'first_name_kana': null,
        'tel': null,
        'email': null,
        'password': null,
    });
    const {valid, setValid, validation} = useValidation(formData, 'admin', 'admin_create');
    const history = useHistory();
    const openAdminMenu = useRecoilValue(menuAdminState);
    const i18next = useI18next();

    return (
        <main>
            <Suspense fallback={<CircularProgress disableShrink />}>
                <div className={ openAdminMenu ? [styles.container_open_menu, styles.max_content].join(' ') : [styles.container, styles.max_content].join(' ') }>
                    <Heading tag={'h1'} tag_style={'h1'} className={styles.mb_16}>{i18next.t('admin.admin.create-title')}</Heading>
                    <div className={styles.form_area}>
                        <form onSubmit={ e => {
                            e.preventDefault();
                            if(validation.fails()) {
                                setValid(true);
                            } else {
                                createData({ 
                                    form: formData, 
                                    url:'/api/admin/admins',
                                    callback: () => history.push('/admin/admins')
                                });
                            }
                        }}>
                            <Text className={styles.mb_8}>{i18next.t('admin.admin.name')}</Text>
                            <div className={[styles.flex, styles.mb_16].join(' ')}>
                                <FormInputText
                                    name={'last_name'}
                                    onChange={handleFormData}
                                    value={formData.last_name}
                                    error={errorMessage}
                                    validation={validation}
                                    valid={valid}
                                    placeholder={i18next.t('admin.admin.last-name-ex')}
                                    className={[styles.mr_24, styles.flex_basis_50].join(' ')}
                                />
                                <FormInputText
                                    name={'first_name'}
                                    onChange={handleFormData}
                                    value={formData.first_name}
                                    error={errorMessage}
                                    validation={validation}
                                    valid={valid}
                                    placeholder={i18next.t('admin.admin.first-name-ex')}
                                    className={styles.flex_basis_50}
                                />
                            </div>
                            <Text className={styles.mb_8}>{i18next.t('admin.admin.name-kana')}</Text>
                            <div className={[styles.flex, styles.mb_16].join(' ')}>
                                <FormInputText 
                                    name={'last_name_kana'} 
                                    onChange={handleFormData} 
                                    value={formData.last_name_kana}
                                    error={errorMessage}
                                    validation={validation}
                                    valid={valid}
                                    placeholder={i18next.t('admin.admin.last-name-kana-ex')}
                                    className={[styles.mr_24, styles.flex_basis_50].join(' ')}
                                />
                                <FormInputText
                                    name={'first_name_kana'}
                                    onChange={handleFormData}
                                    value={formData.first_name_kana}
                                    error={errorMessage}
                                    validation={validation}
                                    valid={valid}
                                    placeholder={i18next.t('admin.admin.first-name-kana-ex')}
                                    className={styles.flex_basis_50}
                                />
                            </div>
                            <FormInputText
                                name={'tel'}
                                type='tel'
                                onChange={handleFormData}
                                value={formData.tel}
                                label={i18next.t('admin.admin.tel')}
                                error={errorMessage}
                                validation={validation}
                                valid={valid}
                                placeholder={i18next.t('admin.admin.tel-ex')}
                                className={styles.mb_16}
                            />
                            <FormInputText
                                name={'email'}
                                type={'email'}
                                onChange={handleFormData}
                                value={formData.email}
                                label={i18next.t('admin.admin.email')}
                                error={errorMessage}
                                validation={validation}
                                valid={valid}
                                placeholder={i18next.t('admin.admin.email-ex')}
                                className={styles.mb_16}
                            />
                            <FormInputText
                                name={'password'}
                                type={'password'}
                                onChange={handleFormData}
                                value={formData.password}
                                label={i18next.t('admin.admin.password')}
                                error={errorMessage}
                                validation={validation}
                                valid={valid}
                                placeholder={i18next.t('admin.admin.password-ex')}
                                className={styles.mb_40}
                            />
                            <div className={[styles.flex, styles.justify_center].join(' ')}>
                                <LinkBtn to={`/admin/admins`} size='l' className={styles.mr_12} style={{'width': '100%'}}>{i18next.t('admin.back-btn')}</LinkBtn>
                                <Button size='l' color='primary' type="submit" className={[styles.ml_12, styles.w_100].join(' ')}>{i18next.t('admin.register')}</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </Suspense>
        </main>
    );
}

export default AdminCreate;
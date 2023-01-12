import { CircularProgress } from '@material-ui/core';
import React, {Suspense} from 'react';
import useForm from '../../../hooks/useForm';
import { authAdminState } from '../../../store/authState';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { menuAdminState } from '../../../store/menuState';
import useAuth from "../../../hooks/useAuth";
import Text from '../../../atoms/Text/Text';
import Heading from '../../../atoms/Heading/Heading';
import FormInputText from '../../../molecules/Form/FormInputText';
import Button from '../../../atoms/Button/Button';
import styles from '../styles.module.css';
import {Link} from "react-router-dom";
import useValidation from '../../../hooks/useValidation';
import useI18next from '../../../context/I18nextContext';

function AdminLogin() {

    const setIsAdminLogin = useSetRecoilState(authAdminState);
    const [formData, {handleFormData}] = useForm({
        'email': 'jun61@example.org', 
        'password': 'abc12345', 
    });
    const {valid, setValid, validation} = useValidation(formData, 'admin', 'login_request');
    const {errorMessage, handleLogin} = useAuth('/api/admin/auth', 'admin');
    const openAdminMenu = useRecoilValue(menuAdminState);
    const i18next = useI18next();

    return (
        <main>
            <Suspense fallback={<CircularProgress disableShrink />}>
                <div className={ openAdminMenu ? [styles.container_open_menu, styles.login_max_content].join(' ') : [styles.container, styles.login_max_content].join(' ') }>
                    <div className={styles.form_area} style={{'marginTop' : '140px'}}>
                        <Heading tag={'h1'} tag_style={'h1'} className={[styles.mb_24, styles.text_center].join(' ')}>
                            {i18next.t('admin.auth.admin-login')}
                        </Heading>
                        <form onSubmit={ e => {
                            e.preventDefault();
                            if(validation.fails()) {
                                setValid(true);
                                return false;
                            }
                            handleLogin({
                                url: '/api/admin/login', 
                                form: formData,
                                callback: () => setIsAdminLogin(true)
                            });
                        }}>
                            <FormInputText
                                name={'email'}
                                type='email'
                                onChange={handleFormData}
                                value={formData.email}
                                label={i18next.t('admin.auth.email')}
                                error={errorMessage}
                                validation={validation}
                                valid={valid}
                                placeholder={i18next.t('admin.auth.email-ex')}
                                className={styles.mb_16}
                            />
                            <FormInputText
                                name={'password'}
                                type='password'
                                onChange={handleFormData}
                                value={formData.password}
                                label={i18next.t('admin.auth.password')}
                                error={errorMessage}
                                validation={validation}
                                valid={valid}
                                placeholder={i18next.t('admin.auth.password-ex')}
                                className={styles.mb_24}
                            />
                            <Button size='l' color='primary' type="submit" className={[styles.mb_8, styles.w_100].join(' ')}>{i18next.t('admin.auth.login')}</Button>
                            <Link to={'/admin/reset_password'}>
                                <Text size='s' className={[styles.text_underline, styles.mb_32].join(' ')}>
                                    {i18next.t('admin.auth.reset-link')}
                                </Text>
                            </Link>
                        </form>
                    </div>
                </div>
            </Suspense>
        </main>
    );
}

export default AdminLogin;




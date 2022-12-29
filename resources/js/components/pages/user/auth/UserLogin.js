import { CircularProgress } from '@material-ui/core';
import React, { Suspense } from 'react';
import useAuth from "../../../hooks/useAuth";
import useForm from '../../../hooks/useForm';
import { authUserState } from '../../../store/authState';
import { useSetRecoilState } from 'recoil';
import Text from '../../../atoms/Text/Text';
import Heading from '../../../atoms/Heading/Heading';
import FormInputText from '../../../molecules/Form/FormInputText';
import Button from '../../../atoms/Button/Button';
import styles from '../styles.module.css';
import {Link} from "react-router-dom";
import LinkBtn from '../../../atoms/LinkButton/LinkBtn';
import useI18next from '../../../context/I18nextContext';

function UserLogin() {

    const setIsUserLogin = useSetRecoilState(authUserState);
    const [formData, {handleFormData}] = useForm({
        'email': 'enagisa@example.org', 
        'password': 'abc12345', 
    });
    const {errorMessage, handleLogin} = useAuth('/api/user/auth', 'user');
    const i18next = useI18next();

    return (
        <main className={styles.mt_40}>
            <Suspense fallback={<CircularProgress disableShrink />}>
                <Heading tag={'h1'} tag_style={'h1'} className={styles.section_title}>
                    {i18next.t('user.auth.login')}
                </Heading>
                <div className={styles.login_area}>
                    <form onSubmit={ e => {
                        e.preventDefault();
                        handleLogin({
                            url: `/api/user/login`, 
                            form: formData,
                            callback: () => setIsUserLogin(true)
                        });
                    }}>
                        <FormInputText
                            name={'email'}
                            type='email'
                            onChange={handleFormData}
                            value={formData.email}
                            label={i18next.t('user.auth.email')}
                            error={errorMessage}
                            placeholder={i18next.t('user.auth.email-ex')}
                            className={styles.mb_16}
                        />
                        <FormInputText
                            name={'password'}
                            type='password'
                            onChange={handleFormData}
                            value={formData.password}
                            label={i18next.t('user.auth.password')}
                            error={errorMessage}
                            placeholder={i18next.t('user.auth.password-ex')}
                            className={styles.mb_24}
                        />
                        <Button size='l' color='primary' type="submit" className={styles.mb_8}>{i18next.t('user.auth.login')}</Button>
                        <Link to={'/user/reset_password'}>
                            <Text size='s' className={[styles.text_underline, styles.mb_32].join(' ')}>
                                {i18next.t('user.auth.reset-link')}
                            </Text>
                        </Link>
                    </form>
                    <div>
                        <Heading tag={'h1'} tag_style={'h1'} className={[styles.title, styles.mb_8, styles.mt_8].join(' ')}>
                            {i18next.t('user.auth.register-user-guide1')}
                        </Heading>
                        <Text size='s' className={styles.mb_24}>
                            {i18next.t('user.auth.register-user-guide2')}
                        </Text>
                        <LinkBtn size='l' color='accent' to={`/users/create`} className={styles.mb_8}>{i18next.t('user.auth.register-user')}</LinkBtn>
                    </div>
                </div>
            </Suspense>
        </main>
    );
}

export default UserLogin;




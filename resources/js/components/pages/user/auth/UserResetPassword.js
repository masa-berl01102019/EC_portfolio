import { CircularProgress } from '@material-ui/core';
import React, { Suspense } from 'react';
import useAuth from "../../../hooks/useAuth";
import useForm from '../../../hooks/useForm';
import { authUserState } from '../../../store/authState';
import { useSetRecoilState } from 'recoil';
import Heading from '../../../atoms/Heading/Heading';
import FormInputText from '../../../molecules/Form/FormInputText';
import Button from '../../../atoms/Button/Button';
import styles from '../styles.module.css';
import useI18next from '../../../context/I18nextContext';

function UserResetPassword() {

    const setIsUserLogin = useSetRecoilState(authUserState);
    const [formData, {handleFormData}] = useForm({
        'email': 'taichi06@example.org'
    });
    const {errorMessage, handleResetPasswordEmail } = useAuth('/api/user/auth', 'user');
    const i18next = useI18next();

    return (
        <main className={styles.mt_40}>
            <Suspense fallback={<CircularProgress disableShrink />}>
                <Heading tag={'h1'} tag_style={'h1'} className={styles.section_title}>
                    {i18next.t('user.auth.reset-password')}
                </Heading>
                <div className={styles.login_area}>
                    <form onSubmit={ e => {
                        e.preventDefault();
                        handleResetPasswordEmail({
                            url: `/api/user/resetPasswords/send`, 
                            form: formData,
                            callback: () => setIsUserLogin(false)
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
                        <Button size='l' color='primary' type="submit" className={styles.mb_8}>
                            {i18next.t('user.auth.send-btn')}
                        </Button>
                    </form>
                </div>
            </Suspense>
        </main>
    );
}

export default UserResetPassword;




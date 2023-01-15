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
import useValidation from '../../../hooks/useValidation';
import { useTranslation } from 'react-i18next';

function UserResetPassword() {

    const setIsUserLogin = useSetRecoilState(authUserState);
    const [formData, {handleFormData}] = useForm({
        'email': ''
    });
    const {valid, setValid, validation} = useValidation(formData, 'user', 'reset_password_request');
    const {errorMessage, handleResetPasswordEmail } = useAuth('/api/user/auth', 'user');
    const { t } = useTranslation();

    return (
        <main className={styles.mt_40}>
            <Suspense fallback={<CircularProgress disableShrink />}>
                <Heading tag={'h1'} tag_style={'h1'} className={styles.section_title}>
                    {t('user.auth.reset-password')}
                </Heading>
                <div className={styles.login_area}>
                    <form onSubmit={ e => {
                        e.preventDefault();
                        if(validation.fails()) {
                            setValid(true);
                            return false;
                        }
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
                            label={t('user.auth.email')}
                            error={errorMessage}
                            validation={validation}
                            valid={valid}
                            placeholder={t('user.auth.email-ex')}
                            className={styles.mb_16}
                        />
                        <Button size='l' color='primary' type="submit" className={styles.mb_8}>
                            {t('user.auth.send-btn')}
                        </Button>
                    </form>
                </div>
            </Suspense>
        </main>
    );
}

export default UserResetPassword;




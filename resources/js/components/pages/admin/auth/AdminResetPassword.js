import { CircularProgress } from '@material-ui/core';
import React, { Suspense } from 'react';
import useAuth from "../../../hooks/useAuth";
import useForm from '../../../hooks/useForm';
import { authAdminState } from '../../../store/authState';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { menuAdminState } from '../../../store/menuState';
import Heading from '../../../atoms/Heading/Heading';
import FormInputText from '../../../molecules/Form/FormInputText';
import Button from '../../../atoms/Button/Button';
import styles from '../styles.module.css';
import useI18next from '../../../context/I18nextContext';

function AdminResetPassword() {

    const setIsAdminLogin = useSetRecoilState(authAdminState);
    const [formData, {handleFormData}] = useForm({
        'email': 'fwakamatsu@example.net'
    });
    const {errorMessage, handleResetPasswordEmail } = useAuth('/api/admin/auth', 'admin');
    const openAdminMenu = useRecoilValue(menuAdminState);
    const i18next = useI18next();

    return (
        <main className={styles.mt_40}>
            <Suspense fallback={<CircularProgress disableShrink />}>
                <div className={ openAdminMenu ? [styles.container_open_menu, styles.login_max_content].join(' ') : [styles.container, styles.login_max_content].join(' ') }>
                    <div className={styles.form_area} style={{'marginTop' : '140px'}}>
                        <Heading tag={'h1'} tag_style={'h1'} className={[styles.mb_24, styles.text_center].join(' ')}>
                            {i18next.t('admin.auth.admin-reset-password')}
                        </Heading>
                        <form onSubmit={ e => {
                            e.preventDefault();
                            handleResetPasswordEmail({
                                url: `/api/admin/resetPasswords/send`, 
                                form: formData,
                                callback: () => setIsAdminLogin(false)
                            });
                        }}>
                            <FormInputText
                                name={'email'}
                                type='email'
                                onChange={handleFormData}
                                value={formData.email}
                                label={i18next.t('admin.auth.email')}
                                error={errorMessage}
                                placeholder={i18next.t('admin.auth.email-ex')}
                                className={styles.mb_24}
                            />
                            <Button size='l' color='primary' type="submit" className={[styles.mb_24, styles.w_100].join(' ')}>
                                {i18next.t('admin.auth.send-btn')}
                            </Button>
                        </form>
                    </div>
                </div>
            </Suspense>
        </main>
    );
}

export default AdminResetPassword;




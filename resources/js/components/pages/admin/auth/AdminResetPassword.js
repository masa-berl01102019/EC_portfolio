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
import useValidation from '../../../hooks/useValidation';
import { useTranslation } from 'react-i18next';

function AdminResetPassword() {

  const setIsAdminLogin = useSetRecoilState(authAdminState);
  const [formData, { handleFormData }] = useForm({
    'email': ''
  });
  const { valid, setValid, validation } = useValidation(formData, 'admin', 'reset_password_request');
  const { errorMessage, handleResetPasswordEmail } = useAuth('/api/admin/auth', 'admin');
  const openAdminMenu = useRecoilValue(menuAdminState);
  const { t } = useTranslation();

  const handleFormSubmit = e => {
    e.preventDefault();
    if (validation.fails()) {
      setValid(true);
      return false;
    }
    handleResetPasswordEmail({
      url: `/api/admin/resetPasswords/send`,
      form: formData,
      callback: () => setIsAdminLogin(false)
    });
  }

  return (
    <main>
      <Suspense fallback={<CircularProgress disableShrink />}>
        <div className={openAdminMenu ? [styles.container_open_menu, styles.login_max_content].join(' ') : [styles.container, styles.login_max_content].join(' ')}>
          <div className={styles.form_area} style={{ 'marginTop': '140px' }}>
            <Heading tag={'h1'} tag_style={'h1'} className={[styles.mb_24, styles.text_center].join(' ')}>
              {t('admin.auth.admin-reset-password')}
            </Heading>
            <form onSubmit={handleFormSubmit}>
              <FormInputText
                name={'email'}
                type='email'
                onChange={handleFormData}
                value={formData.email}
                label={t('admin.auth.email')}
                error={errorMessage}
                validation={validation}
                valid={valid}
                placeholder={t('admin.auth.email-ex')}
                className={styles.mb_24}
              />
              <Button size='l' color='primary' type="submit" className={[styles.mb_24, styles.w_100].join(' ')}>
                {t('admin.auth.send-btn')}
              </Button>
            </form>
          </div>
        </div>
      </Suspense>
    </main>
  );
}

export default AdminResetPassword;

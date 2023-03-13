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
import { Link } from "react-router-dom";
import LinkBtn from '../../../atoms/LinkButton/LinkBtn';
import useValidation from '../../../hooks/useValidation';
import { useTranslation } from 'react-i18next';

function UserLogin() {

  const setIsUserLogin = useSetRecoilState(authUserState);
  const [formData, { handleFormData }] = useForm({
    'email': 'user@test.com',
    'password': 'abc12345',
  });
  const { valid, setValid, validation } = useValidation(formData, 'user', 'login_request');
  const { errorMessage, handleLogin } = useAuth('/api/user/auth', 'user');
  const { t } = useTranslation();

  const handleFormSubmit = e => {
    e.preventDefault();
    if (validation.fails()) {
      setValid(true);
      return false;
    }
    handleLogin({
      url: `/api/user/login`,
      form: formData,
      callback: () => setIsUserLogin(true)
    });
  }

  return (
    <main className={styles.mt_40}>
      <Suspense fallback={<CircularProgress disableShrink />}>
        <Heading tag={'h1'} tag_style={'h1'} className={styles.section_title}>
          {t('user.auth.login')}
        </Heading>
        <div className={styles.login_area}>
          <form onSubmit={handleFormSubmit}>
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
            <FormInputText
              name={'password'}
              type='password'
              onChange={handleFormData}
              value={formData.password}
              label={t('user.auth.password')}
              error={errorMessage}
              validation={validation}
              valid={valid}
              placeholder={t('user.auth.password-ex')}
              className={styles.mb_24}
            />
            <Button size='l' color='primary' type="submit" className={styles.mb_8}>
              {t('user.auth.login')}
            </Button>
            <Link to={'/user/reset_password'}>
              <Text size='s' className={[styles.text_underline, styles.mb_32].join(' ')}>
                {t('user.auth.reset-link')}
              </Text>
            </Link>
          </form>
          <div>
            <Heading tag={'h1'} tag_style={'h1'} className={[styles.title, styles.mb_8, styles.mt_8].join(' ')}>
              {t('user.auth.register-user-guide1')}
            </Heading>
            <Text size='s' className={styles.mb_24}>
              {t('user.auth.register-user-guide2')}
            </Text>
            <LinkBtn size='l' color='accent' to={`/users/create`} className={styles.mb_8}>
              {t('user.auth.register-user')}
            </LinkBtn>
          </div>
        </div>
      </Suspense>
    </main>
  );
}

export default UserLogin;
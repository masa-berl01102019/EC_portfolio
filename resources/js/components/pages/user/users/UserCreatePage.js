import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from "react-router-dom";
import { CircularProgress } from "@material-ui/core";
import useForm from "../../../hooks/useForm";
import useValidation from '../../../hooks/useValidation';
import useFetchApiData from "../../../hooks/useFetchApiData";
import Button from '../../../atoms/Button/Button';
import Heading from '../../../atoms/Heading/Heading';
import LinkBtn from '../../../atoms/LinkButton/LinkBtn';
import UserForm from '../../../organisms/common/Form/UserForm';
import styles from '../styles.module.css';

function UserCreatePage() {

  const baseUrl = '/api/user/users/create';
  const model = 'USER';
  const { data, errorMessage, createData } = useFetchApiData(baseUrl, model);
  const [formData, { handleFormData, handleFormDate }] = useForm({
    'last_name': null,
    'first_name': null,
    'last_name_kana': null,
    'first_name_kana': null,
    'gender': null, // 0:man 1:woman 2:others 3:no answer
    'birthday': null,
    'post_code': null,
    'prefecture': null,
    'municipality': null,
    'street_name': null,
    'street_number': null,
    'building': null,
    'delivery_post_code': null,
    'delivery_prefecture': null,
    'delivery_municipality': null,
    'delivery_street_name': null,
    'delivery_street_number': null,
    'delivery_building': null,
    'tel': null,
    'email': null,
    'password': null,
    'is_received': null, // 0: not register 1: registered
  });
  const { valid, setValid, validation } = useValidation(formData, 'user', 'user_create');
  const history = useHistory();
  const { t } = useTranslation();

  const handleFormSubmit = e => {
    e.preventDefault();
    if (validation.fails()) {
      setValid(true);
    } else {
      createData({
        form: formData,
        url: '/api/user/users',
        callback: () => { history.push('/user/login') }
      });
    }
  }

  return (
    <main className={styles.mt_40}>
      <Suspense fallback={<CircularProgress disableShrink />}>
        <Heading tag={'h1'} tag_style={'h1'} className={styles.section_title}>
          {t('user.user.create-title')}
        </Heading>
        <div className={styles.form_contents_area}>
          <form onSubmit={handleFormSubmit}>
            <UserForm
              formData={formData}
              handleFormData={handleFormData}
              handleFormDate={handleFormDate}
              valid={valid}
              validation={validation}
              errorMessage={errorMessage}
              isEdit={false}
            />
            <div className={[styles.flex, styles.justify_center].join(' ')}>
              <LinkBtn to={`/`} className={[styles.mr_8, styles.btn_max].join(' ')}>
                {t('user.cancel-btn')}
              </LinkBtn>
              <Button color='primary' type="submit" className={[styles.ml_8, styles.btn_max].join(' ')}>
                {t('user.register')}
              </Button>
            </div>
          </form>
        </div>
      </Suspense>
    </main>
  );
}

export default UserCreatePage;

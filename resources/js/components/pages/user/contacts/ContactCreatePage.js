import React, { Suspense, useState } from 'react';
import { useHistory } from "react-router-dom";
import useFetchApiData from "../../../hooks/useFetchApiData";
import { CircularProgress } from "@material-ui/core";
import useForm from "../../../hooks/useForm";
import FormInputText from '../../../molecules/Form/FormInputText';
import FormInputTextarea from '../../../molecules/Form/FormInputTextarea';
import Button from '../../../atoms/Button/Button';
import Heading from '../../../atoms/Heading/Heading';
import Text from '../../../atoms/Text/Text';
import styles from '../styles.module.css';
import LinkBtn from '../../../atoms/LinkButton/LinkBtn';
import LoadingPopup from '../../../molecules/Popup/LoadingPopup';
import useValidation from '../../../hooks/useValidation';
import { useTranslation } from 'react-i18next';

function ContactCreatePage() {

  const baseUrl = `/api/user/contacts`;
  const model = 'CONTACT';
  const { data, errorMessage, createData } = useFetchApiData(baseUrl, model);
  const [formData, { handleFormData }] = useForm({
    'last_name': null,
    'first_name': null,
    'last_name_kana': null,
    'first_name_kana': null,
    'tel': null,
    'email': null,
    'subject': null,
    'message': null,
  });
  const { valid, setValid, validation } = useValidation(formData, 'user', 'contact_request');
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  const handleFormSubmit = e => {
    e.preventDefault();
    if (validation.fails()) {
      setValid(true);
    } else {
      setIsLoading(true);
      createData({
        form: formData,
        url: '/api/user/contacts',
        callback: () => history.push('/contacts/complete')
      });
    }
  }

  return (
    <main className={styles.mt_40}>
      <Suspense fallback={<CircularProgress disableShrink />}>
        {isLoading && !errorMessage && <LoadingPopup isOpen={isLoading}>{t('user.contact.loading-msg')}</LoadingPopup>}
        <Heading tag={'h1'} tag_style={'h1'} className={styles.section_title}>
          {t('user.contact.index-title')}
        </Heading>
        <div className={styles.form_contents_area}>
          <form onSubmit={handleFormSubmit}>
            <Text className={styles.mb_8}>{t('user.contact.name')}</Text>
            <div className={[styles.flex, styles.mb_16].join(' ')}>
              <FormInputText
                name={'last_name'}
                onChange={handleFormData}
                value={formData.last_name}
                error={errorMessage}
                validation={validation}
                valid={valid}
                placeholder={t('user.contact.last-name-ex')}
                className={[styles.mr_24, styles.flex_basis_50].join(' ')}
              />
              <FormInputText
                name={'first_name'}
                onChange={handleFormData}
                value={formData.first_name}
                error={errorMessage}
                validation={validation}
                valid={valid}
                placeholder={t('user.contact.first-name-ex')}
                className={styles.flex_basis_50}
              />
            </div>
            <Text className={styles.mb_8}>{t('user.contact.name-kana')}</Text>
            <div className={[styles.flex, styles.mb_16].join(' ')}>
              <FormInputText
                name={'last_name_kana'}
                onChange={handleFormData}
                value={formData.last_name_kana}
                error={errorMessage}
                validation={validation}
                valid={valid}
                placeholder={t('user.contact.last-name-kana-ex')}
                className={[styles.mr_24, styles.flex_basis_50].join(' ')}
              />
              <FormInputText
                name={'first_name_kana'}
                onChange={handleFormData}
                value={formData.first_name_kana}
                error={errorMessage}
                validation={validation}
                valid={valid}
                placeholder={t('user.contact.first-name-kana-ex')}
                className={styles.flex_basis_50}
              />
            </div>
            <FormInputText
              name={'tel'}
              type='tel'
              onChange={handleFormData}
              value={formData.tel}
              label={t('user.contact.tel')}
              error={errorMessage}
              validation={validation}
              valid={valid}
              placeholder={t('user.contact.tel-ex')}
              className={styles.mb_16}
            />
            <FormInputText
              name={'email'}
              type={'email'}
              onChange={handleFormData}
              value={formData.email}
              label={t('user.contact.email')}
              error={errorMessage}
              validation={validation}
              valid={valid}
              placeholder={t('user.contact.email-ex')}
              className={styles.mb_16}
            />
            <FormInputText
              name={'subject'}
              onChange={handleFormData}
              value={formData.subject}
              label={t('user.contact.subject')}
              error={errorMessage}
              validation={validation}
              valid={valid}
              placeholder={t('user.contact.subject-ex')}
              className={styles.mb_16}
            />
            <FormInputTextarea
              name={'message'}
              value={formData.message}
              label={t('user.contact.message')}
              onChange={handleFormData}
              placeholder={t('user.contact.message-ex')}
              error={errorMessage}
              validation={validation}
              valid={valid}
              className={styles.mb_40}
              style={{ 'minHeight': '250px' }}
            />
            <div className={[styles.flex, styles.justify_center].join(' ')}>
              <LinkBtn to={`/`} className={[styles.mr_8, styles.btn_max].join(' ')}>
                {t('user.cancel-btn')}
              </LinkBtn>
              <Button color='primary' type="submit" className={[styles.ml_8, styles.btn_max].join(' ')}>
                {t('user.contact.contact-btn')}
              </Button>
            </div>
          </form>
        </div>
      </Suspense>
    </main>
  );
}

export default ContactCreatePage;

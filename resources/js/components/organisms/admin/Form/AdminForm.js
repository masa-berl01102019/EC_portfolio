import React, { memo } from 'react';
import { useHistory } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import useForm from "../../../hooks/useForm";
import useValidation from '../../../hooks/useValidation';
import Text from '../../../atoms/Text/Text';
import Button from '../../../atoms/Button/Button';
import LinkBtn from '../../../atoms/LinkButton/LinkBtn';
import FormInputText from '../../../molecules/Form/FormInputText';
import styles from './styles.module.css';

const AdminForm = memo(({
  data,
  mutation,
  serverErrorMsg,
  targetId = null,
  isEdit,
  className = '',
  ...props
}) => {

  const intialFormData = {
    'last_name': '',
    'first_name': '',
    'last_name_kana': '',
    'first_name_kana': '',
    'tel': '',
    'email': '',
    'password': ''
  }
  const [formData, { handleFormData }] = useForm(isEdit ? data.admin : intialFormData);
  const { valid, setValid, validation } = useValidation(formData, 'admin', isEdit ? 'admin_edit' : 'admin_create');
  const requestUrl = isEdit ? `/api/admin/admins/${targetId}` : `/api/admin/admins`;
  const history = useHistory();
  const { t } = useTranslation();

  const handleFormSubmit = e => {
    e.preventDefault();
    if (validation.fails()) {
      setValid(true);
    } else {
      mutation({
        form: formData,
        url: requestUrl,
        callback: () => history.push('/admin/admins')
      });
    }
  }

  return (
    <div className={[styles.form_area, className].join(' ')}>
      <form onSubmit={handleFormSubmit} {...props}>
        <div className={styles.mb_40}>
          <Text className={styles.mb_8}>{t('admin.admin.name')}</Text>
          <div className={[styles.flex, styles.mb_16].join(' ')}>
            <FormInputText
              name={'last_name'}
              onChange={handleFormData}
              value={formData.last_name}
              error={serverErrorMsg}
              validation={validation}
              valid={valid}
              placeholder={t('admin.admin.last-name-ex')}
              className={[styles.mr_24, styles.flex_basis_50].join(' ')}
            />
            <FormInputText
              name={'first_name'}
              onChange={handleFormData}
              value={formData.first_name}
              error={serverErrorMsg}
              validation={validation}
              valid={valid}
              placeholder={t('admin.admin.first-name-ex')}
              className={styles.flex_basis_50}
            />
          </div>
          <Text className={styles.mb_8}>{t('admin.admin.name-kana')}</Text>
          <div className={[styles.flex, styles.mb_16].join(' ')}>
            <FormInputText
              name={'last_name_kana'}
              onChange={handleFormData}
              value={formData.last_name_kana}
              error={serverErrorMsg}
              validation={validation}
              valid={valid}
              placeholder={t('admin.admin.last-name-kana-ex')}
              className={[styles.mr_24, styles.flex_basis_50].join(' ')}
            />
            <FormInputText
              name={'first_name_kana'}
              onChange={handleFormData}
              value={formData.first_name_kana}
              error={serverErrorMsg}
              validation={validation}
              valid={valid}
              placeholder={t('admin.admin.first-name-kana-ex')}
              className={styles.flex_basis_50}
            />
          </div>
          <FormInputText
            name={'tel'}
            onChange={handleFormData}
            value={formData.tel}
            label={t('admin.admin.tel')}
            error={serverErrorMsg}
            validation={validation}
            valid={valid}
            placeholder={t('admin.admin.tel-ex')}
            className={styles.mb_16}
          />
          <FormInputText
            name={'email'}
            type={'email'}
            onChange={handleFormData}
            value={formData.email}
            label={t('admin.admin.email')}
            error={serverErrorMsg}
            validation={validation}
            valid={valid}
            placeholder={t('admin.admin.email-ex')}
            className={!isEdit ? styles.mb_16 : ''}
          />
          {!isEdit &&
            <FormInputText
              name={'password'}
              type={'password'}
              onChange={handleFormData}
              value={formData.password}
              label={t('admin.admin.password')}
              error={serverErrorMsg}
              validation={validation}
              valid={valid}
              placeholder={t('admin.admin.password-ex')}
            />
          }
        </div>
        <div className={[styles.flex, styles.justify_center].join(' ')}>
          <LinkBtn to={`/admin/admins`} size='l' className={styles.mr_12} style={{ 'width': '100%' }}>
            {t('admin.back-btn')}
          </LinkBtn>
          <Button size='l' color='primary' type="submit" className={[styles.ml_12, styles.w_100].join(' ')}>
            {isEdit ? t('admin.update') : t('admin.register')}
          </Button>
        </div>
      </form>
    </div>
  );
});

export default AdminForm;
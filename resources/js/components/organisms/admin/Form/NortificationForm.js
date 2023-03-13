import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from "react-router-dom";
import useForm from "../../../hooks/useForm";
import useValidation from '../../../hooks/useValidation';
import useNotify from '../../../context/NotifyContext';
import Button from '../../../atoms/Button/Button';
import LinkBtn from '../../../atoms/LinkButton/LinkBtn';
import FormSelectbox from '../../../molecules/Form/FormSelectbox';
import FormInputText from '../../../molecules/Form/FormInputText';
import FormDatePicker from '../../../molecules/Form/FormDatePicker';
import FormInputTextarea from '../../../molecules/Form/FormInputTextarea';
import styles from './styles.module.css';
import { CONST } from '../../../constants/constants';

const NortificationForm = memo(({
  data,
  mutation,
  serverErrorMsg,
  targetId = null,
  isEdit,
  className = '',
  ...props
}) => {

  const intialFormData = {
    'title': '',
    'body': '',
    'is_published': CONST.IS_PUBLISHED.NOT_PUBLISHED,
    'expired_at': null
  }
  const [formData, { handleFormData, handleFormDate }] = useForm(isEdit ? data.notification : intialFormData);
  const { valid, setValid, validation } = useValidation(formData, 'admin', 'notification_request');
  const requestUrl = isEdit ? `/api/admin/notifications/${targetId}` : `/api/admin/notifications`;
  const history = useHistory();
  const confirm = useNotify();
  const { t } = useTranslation();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (validation.fails()) {
      setValid(true);
    } else {
      let result = true;
      if (formData.is_published == CONST.IS_PUBLISHED.PUBLISHED && formData.expired_at === null) {
        result = await confirm({
          body: t('admin.notification.confirm-msg'),
          confirmBtnLabel: t('admin.yes-btn')
        });
      }
      result && mutation({
        form: formData,
        url: requestUrl,
        callback: () => history.push('/admin/notifications')
      });
    }
  }

  return (
    <div className={[styles.form_area, className].join(' ')}>
      <form onSubmit={handleFormSubmit} {...props}>
        <FormInputText
          name={'title'}
          onChange={handleFormData}
          value={formData.title}
          label={t('admin.notification.title')}
          error={serverErrorMsg}
          validation={validation}
          valid={valid}
          placeholder={t('admin.notification.title-ex')}
          className={styles.mb_16}
        />
        <FormInputTextarea
          name={'body'}
          value={formData.body}
          onChange={handleFormData}
          label={t('admin.notification.body')}
          error={serverErrorMsg}
          validation={validation}
          valid={valid}
          placeholder={t('admin.notification.body-ex')}
          className={styles.mb_16}
          style={{ 'minHeight': '250px' }}
        />
        <div className={[styles.flex, styles.mb_40, styles.flex_sp].join(' ')}>
          <FormSelectbox
            name='is_published'
            value={formData.is_published}
            onChange={handleFormData}
            label={t('admin.set-published-status')}
            error={serverErrorMsg}
            validation={validation}
            valid={valid}
            className={[styles.flex_grow, styles.mr_24, styles.mb_16_sp].join(' ')}
          >
            <option value={CONST.IS_PUBLISHED.NOT_PUBLISHED}>{t('admin.unpublished')}</option>
            <option value={CONST.IS_PUBLISHED.PUBLISHED}>{t('admin.published')}</option>
          </FormSelectbox>
          <FormDatePicker
            name={'expired_at'}
            value={formData.expired_at}
            onChange={handleFormDate}
            label={t('admin.notification.expired-date')}
            className={styles.mb_10}
            error={serverErrorMsg}
            validation={validation}
            valid={valid}
            openTo="date"
          />
        </div>
        <div className={[styles.flex, styles.justify_center].join(' ')}>
          <LinkBtn to={`/admin/notifications`} size='l' className={styles.mr_12} style={{ 'width': '100%' }} >
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

export default NortificationForm;
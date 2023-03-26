import React, { Suspense } from 'react';
import { useHistory } from "react-router-dom";
import useFetchApiData from "../../../hooks/useFetchApiData";
import { CircularProgress } from "@material-ui/core";
import useForm from "../../../hooks/useForm";
import Heading from '../../../atoms/Heading/Heading';
import FormSelectbox from '../../../molecules/Form/FormSelectbox';
import Button from '../../../atoms/Button/Button';
import Text from '../../../atoms/Text/Text';
import styles from '../styles.module.css';
import LinkBtn from '../../../atoms/LinkButton/LinkBtn';
import { menuAdminState } from '../../../store/menuState';
import { useRecoilValue } from 'recoil';
import FormInputTextarea from '../../../molecules/Form/FormInputTextarea';
import useValidation from '../../../hooks/useValidation';
import { useTranslation } from 'react-i18next';
import { CONST } from '../../../constants/constants';
import useHelper from '../../../hooks/useHelper'

function ContactEdit(props) {

  const baseUrl = `/api/admin/contacts/${props.match.params.id}/edit`;
  const model = 'CONTACT';
  const { data, errorMessage, updateData } = useFetchApiData(baseUrl, model);
  const [formData, { handleFormData }] = useForm(data.contact);
  const { valid, setValid, validation } = useValidation(formData, 'admin', 'contact_request');
  const history = useHistory();
  const openAdminMenu = useRecoilValue(menuAdminState);
  const { t } = useTranslation();
  const { check } = useHelper();

  const handleFormSubmit = e => {
    e.preventDefault();
    if (validation.fails()) {
      setValid(true);
      return false;
    }
    updateData({
      form: formData,
      url: `/api/admin/contacts/${props.match.params.id}`,
      callback: () => history.push('/admin/contacts')
    });
  }

  return (
    <main>
      <Suspense fallback={<CircularProgress disableShrink />}>
        <div className={openAdminMenu ? [styles.container_open_menu, styles.max_content].join(' ') : [styles.container, styles.max_content].join(' ')}>
          <Heading tag={'h1'} tag_style={'h1'} className={styles.mb_16}>{t('admin.contact.edit-title')}</Heading>
          <div className={styles.form_area}>
            <form onSubmit={handleFormSubmit}>
              <Heading tag={'h2'} tag_style={'h3'} className={styles.contents_header}>{t('admin.contact.info')}</Heading>
              <div className={styles.contents_body}>
                <Text className={styles.mb_4}>
                  {t('admin.contact.name')}:
                  {formData.full_name}
                  {check(formData.full_name_kana) && `(${formData.full_name_kana})`}
                </Text>
                <Text className={styles.mb_4}>{t('admin.contact.tel')}: {formData.tel}</Text>
                <Text className={styles.mb_4}>{t('admin.contact.email')}: {formData.email}</Text>
                <Text>{t('admin.contact.contacted-date')}: {formData.created_at}</Text>
              </div>

              <Heading tag={'h2'} tag_style={'h3'} className={styles.contents_header}>{t('admin.contact.subject')}</Heading>
              <Text className={styles.contents_body}>{formData.subject}</Text>
              <Heading tag={'h2'} tag_style={'h3'} className={styles.contents_header}>{t('admin.contact.message')}</Heading>
              <Text className={styles.contents_body}>{formData.message}</Text>

              <FormInputTextarea
                name={'memo'}
                value={formData.memo}
                onChange={handleFormData}
                label={t('admin.contact.memo')}
                error={errorMessage}
                validation={validation}
                placeholder={t('admin.contact.memo-ex')}
                valid={valid}
                className={styles.mb_16}
                style={{ 'minHeight': '148px' }}
              />

              <FormSelectbox
                name='response_status'
                value={formData.response_status}
                onChange={handleFormData}
                label={t('admin.contact.response-status')}
                error={errorMessage}
                validation={validation}
                valid={valid}
                className={styles.mb_40}
              >
                <option value={CONST.RESPONSE_STATUS.YET}>{t('admin.contact.response-yet')}</option>
                <option value={CONST.RESPONSE_STATUS.DURING}>{t('admin.contact.response-during')}</option>
                <option value={CONST.RESPONSE_STATUS.DONE}>{t('admin.contact.response-done')}</option>
              </FormSelectbox>

              <div className={[styles.flex, styles.justify_center].join(' ')}>
                <LinkBtn to={`/admin/contacts`} size='l' className={styles.mr_12} style={{ 'width': '100%' }}>
                  {t('admin.back-btn')}
                </LinkBtn>
                <Button size='l' color='primary' type="submit" className={[styles.ml_12, styles.w_100].join(' ')}>
                  {t('admin.update')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </Suspense>
    </main>
  );
}

export default ContactEdit;

import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from "react-router-dom";
import { useRecoilValue } from 'recoil';
import { menuAdminState } from '../../../store/menuState';
import { CircularProgress } from "@material-ui/core";
import useForm from "../../../hooks/useForm";
import useValidation from '../../../hooks/useValidation';
import useFetchApiData from "../../../hooks/useFetchApiData";
import Button from '../../../atoms/Button/Button';
import Heading from '../../../atoms/Heading/Heading';
import LinkBtn from '../../../atoms/LinkButton/LinkBtn';
import UserForm from '../../../organisms/common/Form/UserForm';
import styles from '../styles.module.css';

function UserEdit(props) {

  const baseUrl = `/api/admin/users/${props.match.params.id}/edit`;
  const model = 'USER';
  const { data, errorMessage, updateData } = useFetchApiData(baseUrl, model);
  const [formData, { handleFormData, handleFormDate }] = useForm(data.user);
  const { valid, setValid, validation } = useValidation(formData, 'admin', 'user_edit');
  const history = useHistory();
  const openAdminMenu = useRecoilValue(menuAdminState);
  const { t } = useTranslation();

  const handleFormSubmit = e => {
    e.preventDefault();
    if (validation.fails()) {
      setValid(true);
    } else {
      updateData({
        form: formData,
        url: `/api/admin/users/${props.match.params.id}`,
        callback: () => history.push('/admin/users')
      });
    }
  }

  return (
    <main>
      <Suspense fallback={<CircularProgress disableShrink />}>
        <div className={openAdminMenu ? [styles.container_open_menu, styles.max_content].join(' ') : [styles.container, styles.max_content].join(' ')}>
          <Heading tag={'h1'} tag_style={'h1'} className={styles.mb_16}>
            {t('admin.user.edit-title')}
          </Heading>
          <div className={styles.form_area}>
            <form onSubmit={handleFormSubmit}>
              <UserForm
                formData={formData}
                handleFormData={handleFormData}
                handleFormDate={handleFormDate}
                valid={valid}
                validation={validation}
                errorMessage={errorMessage}
              />
              <div className={[styles.flex, styles.justify_center].join(' ')}>
                <LinkBtn to={`/admin/users`} size='l' className={styles.mr_12} style={{ 'width': '100%' }} >
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

export default UserEdit;
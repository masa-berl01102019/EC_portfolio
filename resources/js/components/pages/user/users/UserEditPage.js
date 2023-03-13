import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useHistory } from "react-router-dom";
import { CircularProgress } from "@material-ui/core";
import useForm from "../../../hooks/useForm";
import useValidation from '../../../hooks/useValidation';
import useFetchApiData from "../../../hooks/useFetchApiData";
import Button from '../../../atoms/Button/Button';
import Heading from '../../../atoms/Heading/Heading';
import LinkBtn from '../../../atoms/LinkButton/LinkBtn';
import UserForm from '../../../organisms/common/Form/UserForm';
import styles from '../styles.module.css';

function UserEditPage() {

  const baseUrl = `/api/user/users/edit`;
  const model = 'USER';
  const { data, errorMessage, updateData } = useFetchApiData(baseUrl, model);
  const [formData, { handleFormData, handleFormDate }] = useForm(data.user);
  const { valid, setValid, validation } = useValidation(formData, 'user', 'user_edit');
  const history = useHistory();
  const { t } = useTranslation();

  const handleFormSubmit = e => {
    e.preventDefault();
    if (validation.fails()) {
      setValid(true);
    } else {
      updateData({
        form: formData,
        url: `/api/user/users/${formData.id}`,
        callback: () => history.push('/users/edit/complete')
      });
    }
  }

  return (
    <main className={styles.mt_40}>
      <Suspense fallback={<CircularProgress disableShrink />}>
        <Heading tag={'h1'} tag_style={'h1'} className={styles.section_title}>
          {t('user.user.edit-title')}
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
            />
            <div className={[styles.flex, styles.justify_center, styles.mb_40].join(' ')}>
              <LinkBtn to={`/`} className={[styles.mr_8, styles.btn_max].join(' ')}>
                {t('user.cancel-btn')}
              </LinkBtn>
              <Button color='primary' type="submit" className={[styles.ml_8, styles.btn_max].join(' ')}>
                {t('user.update-btn')}
              </Button>
            </div>
            <Link to={'/users/delete'} className={styles.delete_link}>
              {t('user.user.delete.link')}
            </Link>
          </form>
        </div>
      </Suspense>
    </main>
  );
}

export default UserEditPage;
import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { useRecoilValue } from 'recoil';
import { menuAdminState } from '../../../store/menuState';
import { CircularProgress } from "@material-ui/core";
import useFetchApiData from "../../../hooks/useFetchApiData";
import Heading from '../../../atoms/Heading/Heading';
import AdminForm from '../../../organisms/admin/Form/AdminForm';
import styles from '../styles.module.css';

function AdminCreate() {

  const baseUrl = '/api/admin/admins/create';
  const model = 'ADMIN';
  const { data, errorMessage, createData } = useFetchApiData(baseUrl, model);
  const openAdminMenu = useRecoilValue(menuAdminState);
  const { t } = useTranslation();

  return (
    <main>
      <Suspense fallback={<CircularProgress disableShrink />}>
        <div className={openAdminMenu ? [styles.container_open_menu, styles.max_content].join(' ') : [styles.container, styles.max_content].join(' ')}>
          <Heading tag={'h1'} tag_style={'h1'} className={styles.mb_16}>
            {t('admin.admin.create-title')}
          </Heading>
          <AdminForm
            data={data}
            mutation={createData}
            serverErrorMsg={errorMessage}
            isEdit={false}
          />
        </div>
      </Suspense>
    </main>
  );
}

export default AdminCreate;
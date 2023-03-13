import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { useRecoilValue } from 'recoil';
import { menuAdminState } from '../../../store/menuState';
import { CircularProgress } from "@material-ui/core";
import useFetchApiData from "../../../hooks/useFetchApiData";
import Heading from '../../../atoms/Heading/Heading';
import NortificationForm from '../../../organisms/admin/Form/NortificationForm';
import styles from '../styles.module.css';

function NotificationEdit(props) {

  const baseUrl = `/api/admin/notifications/${props.match.params.id}/edit`;
  const model = 'NOTIFICATION';
  const { data, errorMessage, updateData } = useFetchApiData(baseUrl, model);
  const openAdminMenu = useRecoilValue(menuAdminState);
  const { t } = useTranslation();

  return (
    <main>
      <Suspense fallback={<CircularProgress disableShrink />}>
        <div className={openAdminMenu ? [styles.container_open_menu, styles.max_content].join(' ') : [styles.container, styles.max_content].join(' ')}>
          <Heading tag={'h1'} tag_style={'h1'} className={styles.mb_16}>
            {t('admin.notification.edit-title')}
          </Heading>
          <NortificationForm
            data={data}
            mutation={updateData}
            serverErrorMsg={errorMessage}
            targetId={props.match.params.id}
            isEdit={true}
          />
        </div>
      </Suspense>
    </main>
  );
}

export default NotificationEdit;

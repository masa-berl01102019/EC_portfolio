import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { useRecoilValue } from 'recoil';
import { menuAdminState } from '../../../store/menuState';
import { CircularProgress } from "@material-ui/core";
import useFetchApiData from "../../../hooks/useFetchApiData";
import Heading from '../../../atoms/Heading/Heading';
import ItemForm from '../../../organisms/admin/Form/ItemForm';
import styles from '../styles.module.css';

function ItemCreate() {

  const baseUrl = `/api/admin/items/create`;
  const model = 'ITEM';
  const { data, errorMessage, createData } = useFetchApiData(baseUrl, model);
  const openAdminMenu = useRecoilValue(menuAdminState);
  const { t } = useTranslation();

  return (
    <main>
      <Suspense fallback={<CircularProgress disableShrink />}>
        <div className={openAdminMenu ? [styles.container_open_menu, styles.max_content].join(' ') : [styles.container, styles.max_content].join(' ')}>
          <Heading tag={'h1'} tag_style={'h1'} className={styles.mb_16}>
            {t('admin.item.create-title')}
          </Heading>
          <ItemForm
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

export default ItemCreate;

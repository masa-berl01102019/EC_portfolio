import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { useRecoilValue } from 'recoil';
import { menuAdminState } from '../../../store/menuState';
import { CircularProgress } from "@material-ui/core";
import useFetchApiData from "../../../hooks/useFetchApiData";
import Heading from '../../../atoms/Heading/Heading';
import BlogForm from '../../../organisms/admin/Form/BlogForm';
import styles from '../styles.module.css';

// TODO: Add preview fuction

function BlogCreate() {

  const baseUrl = '/api/admin/blogs/create';
  const model = 'BLOG';
  const { data, errorMessage, createData } = useFetchApiData(baseUrl, model);
  const openAdminMenu = useRecoilValue(menuAdminState);
  const { t } = useTranslation();

  return (
    <main>
      <Suspense fallback={<CircularProgress disableShrink />}>
        <div className={openAdminMenu ? [styles.container_open_menu, styles.media_max_content].join(' ') : [styles.container, styles.media_max_content].join(' ')}>
          <Heading tag={'h1'} tag_style={'h1'} className={styles.mb_16}>
            {t('admin.blog.create-title')}
          </Heading>
          <BlogForm
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

export default BlogCreate;
import React, { Suspense } from 'react';
import useFetchApiData from "../../../hooks/useFetchApiData";
import { CircularProgress } from "@material-ui/core";
import useAuth from "../../../hooks/useAuth";
import Button from '../../../atoms/Button/Button';
import Heading from '../../../atoms/Heading/Heading';
import Text from '../../../atoms/Text/Text';
import styles from '../styles.module.css';
import LinkBtn from '../../../atoms/LinkButton/LinkBtn';
import { useSetRecoilState } from 'recoil';
import { authUserState } from '../../../store/authState';
import useNotify from '../../../context/NotifyContext';
import { useTranslation } from 'react-i18next';

function UserDeletePage() {

  const baseUrl = `/api/user/users/edit`;
  const model = 'USER';
  const { data, errorMessage, deleteData } = useFetchApiData(baseUrl, model);
  const { handleLogout } = useAuth('/api/user/auth', 'user');
  const setIsUserLogin = useSetRecoilState(authUserState);
  const confirm = useNotify();
  const { t } = useTranslation();

  const handleConfirmDelete = async (id) => {
    const result = await confirm({
      body: t('user.user.delete.confirm'),
      confirmBtnLabel: t('user.yes-btn')
    });
    result && deleteData({
      url: `/api/user/users/${id}`,
      callback: () => {
        handleLogout();
        setIsUserLogin(false);
      }
    });
  }

  return (
    <main className={styles.mt_40}>
      <Suspense fallback={<CircularProgress disableShrink />}>
        <Heading tag={'h1'} tag_style={'h1'} className={styles.section_title}>
          {t('user.user.delete.title')}
        </Heading>
        <div className={styles.form_contents_area}>
          <Text className={[styles.paragraph, styles.mb_16].join(' ')}>
            {t('user.user.delete.p1')}<br />
            {t('user.user.delete.p2')}<br />
            {t('user.user.delete.p3')}
          </Text>
          <Text role='error' className={[styles.paragraph, styles.mb_8].join(' ')}>
            {t('user.user.delete.p4')}
          </Text>
          <Text role='error' className={[styles.paragraph, styles.mb_32].join(' ')}>
            {t('user.user.delete.p5')}<br />
            {t('user.user.delete.p6')}
          </Text>
          <div className={[styles.flex, styles.flex_column, styles.align_center].join(' ')}>
            <Button
              size='l'
              color='accent'
              onClick={() => handleConfirmDelete(data.user.id)}
              className={[styles.mb_16, styles.btn_max].join(' ')}
            >
              {t('user.user.delete.btn')}
            </Button>
            <LinkBtn size='l' to={`/`} className={styles.btn_max}>{t('user.cancel-btn')}</LinkBtn>
          </div>
        </div>
      </Suspense>
    </main>
  );
}

export default UserDeletePage;
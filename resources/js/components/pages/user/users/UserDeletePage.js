import React, {Suspense} from 'react';
import useFetchApiData from "../../../hooks/useFetchApiData";
import {CircularProgress} from "@material-ui/core";
import useAuth from "../../../hooks/useAuth";
import Button from '../../../atoms/Button/Button';
import Heading from '../../../atoms/Heading/Heading';
import Text from '../../../atoms/Text/Text';
import styles from '../styles.module.css';
import LinkBtn from '../../../atoms/LinkButton/LinkBtn';
import { useSetRecoilState } from 'recoil';
import { authUserState } from '../../../store/authState';
import useNotify from '../../../context/NotifyContext';
import useI18next from '../../../context/I18nextContext';

function UserDeletePage() {

    const baseUrl = `/api/user/users/edit`;
    const model = 'USER';
    const {data, errorMessage, deleteData} = useFetchApiData(baseUrl, model);
    const {handleLogout} = useAuth('/api/user/auth', 'user');
    const setIsUserLogin = useSetRecoilState(authUserState);
    const confirm = useNotify();
    const i18next = useI18next();

    const handleConfirmDelete = async (id) => {
        const result = await confirm({
            body : i18next.t('user.user.delete.confirm'),
            confirmBtnLabel : i18next.t('user.yes-btn')
        });
        result && deleteData({
            url:`/api/user/users/${id}`,
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
                    {i18next.t('user.user.delete.title')}
                </Heading>
                <div className={styles.form_contents_area}>
                    <Text className={[styles.paragraph, styles.mb_16].join(' ')}>
                        {i18next.t('user.user.delete.p1')}<br/>
                        {i18next.t('user.user.delete.p2')}<br/>
                        {i18next.t('user.user.delete.p3')}
                    </Text>
                    <Text role='error' className={[styles.paragraph, styles.mb_8].join(' ')}>
                        {i18next.t('user.user.delete.p4')}
                    </Text>
                    <Text role='error'  className={[styles.paragraph, styles.mb_32].join(' ')}>
                        {i18next.t('user.user.delete.p5')}<br/>
                        {i18next.t('user.user.delete.p6')}
                    </Text>
                    <div className={[styles.flex, styles.flex_column, styles.align_center].join(' ')}>
                        <Button 
                            size='l'
                            color='accent'
                            onClick={() => handleConfirmDelete(data.user.id)}
                            className={[styles.mb_16, styles.btn_max].join(' ')}
                        >
                            {i18next.t('user.user.delete.btn')}
                        </Button>
                        <LinkBtn size='l' to={`/`} className={styles.btn_max}>{i18next.t('user.cancel-btn')}</LinkBtn>
                    </div>
                </div>
            </Suspense>
        </main>
    );
}

export default UserDeletePage;
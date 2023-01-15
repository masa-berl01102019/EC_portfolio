import { CircularProgress } from '@material-ui/core';
import {useHistory} from "react-router-dom";
import React, { Suspense } from 'react';
import { useRecoilValue } from 'recoil';
import { menuAdminState } from '../../../store/menuState';
import useAuth from "../../../hooks/useAuth";
import useForm from '../../../hooks/useForm';
import Heading from '../../../atoms/Heading/Heading';
import FormInputText from '../../../molecules/Form/FormInputText';
import Button from '../../../atoms/Button/Button';
import styles from '../styles.module.css';
import useValidation from '../../../hooks/useValidation';
import { useTranslation } from 'react-i18next';

function AdminChangePassword(props) {

    const [formData, {handleFormData}] = useForm({
        'uuid': props.match.params.uuid,
        'password': null
    });
    const {valid, setValid, validation} = useValidation(formData, 'admin', 'change_password_request');
    const {errorMessage, handleChangePassword } = useAuth('/api/admin/auth', 'admin');
    const history = useHistory();
    const openAdminMenu = useRecoilValue(menuAdminState);
    const { t } = useTranslation();

    return (
        <main className={styles.mt_40}>
            <Suspense fallback={<CircularProgress disableShrink />}>
                <div className={ openAdminMenu ? [styles.container_open_menu, styles.login_max_content].join(' ') : [styles.container, styles.login_max_content].join(' ') }>
                    <div className={styles.form_area} style={{'marginTop' : '140px'}}>
                        <Heading tag={'h1'} tag_style={'h1'} className={[styles.mb_24, styles.text_center].join(' ')}>
                            {t('admin.auth.admin-change-password')}
                        </Heading>
                        <form onSubmit={ e => {
                            e.preventDefault();
                            if(validation.fails()) {
                                setValid(true);
                                return false;
                            }
                            handleChangePassword({
                                url: `/api/admin/resetPasswords/change`, 
                                form: formData,
                                callback: () => history.push('/admin/login')
                            });
                        }}>
                            <FormInputText
                                name={'password'}
                                type={'password'}
                                onChange={handleFormData}
                                value={formData.password}
                                label={t('admin.auth.password')}
                                error={errorMessage}
                                validation={validation}
                                valid={valid}
                                placeholder={t('admin.auth.password-ex')}
                                className={styles.mb_24}
                            />
                            <Button size='l' color='primary' type="submit" className={[styles.mb_24, styles.w_100].join(' ')}>
                                {t('admin.auth.change-btn')}
                            </Button>
                        </form>
                    </div>
                </div>
            </Suspense>
        </main>
    );
}

export default AdminChangePassword;
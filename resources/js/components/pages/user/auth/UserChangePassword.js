import { CircularProgress } from '@material-ui/core';
import {useHistory} from "react-router-dom";
import React, { Suspense } from 'react';
import useAuth from "../../../hooks/useAuth";
import useForm from '../../../hooks/useForm';
import Heading from '../../../atoms/Heading/Heading';
import FormInputText from '../../../molecules/Form/FormInputText';
import Button from '../../../atoms/Button/Button';
import styles from '../styles.module.css';
import useValidation from '../../../hooks/useValidation';
import useI18next from '../../../context/I18nextContext';

function UserChangePassword(props) {

    const [formData, {handleFormData}] = useForm({
        'uuid': props.match.params.uuid,
        'password': null
    });
    const {valid, setValid, validation} = useValidation(formData, 'user', 'change_password_request');
    const {errorMessage, handleChangePassword } = useAuth('/api/user/auth', 'user');
    const history = useHistory();
    const i18next = useI18next();

    return (
        <main className={styles.mt_40}>
            <Suspense fallback={<CircularProgress disableShrink />}>
                <Heading tag={'h1'} tag_style={'h1'} className={styles.section_title}>
                    {i18next.t('user.auth.change-password')}
                </Heading>
                <div className={styles.login_area}>
                    <form onSubmit={ e => {
                        e.preventDefault();
                        if(validation.fails()) {
                            setValid(true);
                            return false;
                        }
                        handleChangePassword({
                            url: `/api/user/resetPasswords/change`, 
                            form: formData,
                            callback: () => history.push('/user/login')
                        });
                    }}>
                        <FormInputText
                            name={'password'}
                            type={'password'}
                            onChange={handleFormData}
                            value={formData.password}
                            label={i18next.t('user.auth.password')}
                            error={errorMessage}
                            validation={validation}
                            valid={valid}
                            placeholder={i18next.t('user.auth.password-ex')}
                            className={styles.mb_16}
                        />
                        <Button size='l' color='primary' type="submit" className={styles.mb_8}>
                            {i18next.t('user.auth.change-btn')}
                        </Button>
                    </form>
                </div>
            </Suspense>
        </main>
    );
}

export default UserChangePassword;
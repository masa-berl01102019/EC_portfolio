import { CircularProgress } from '@material-ui/core';
import {useHistory} from "react-router-dom";
import React, { Suspense } from 'react';
import useAuth from "../../../hooks/useAuth";
import useForm from '../../../hooks/useForm';
import Text from '../../../atoms/Text/Text';
import Heading from '../../../atoms/Heading/Heading';
import FormInputText from '../../../molecules/Form/FormInputText';
import Button from '../../../atoms/Button/Button';
import styles from '../styles.module.css';

function UserChangePassword(props) {

    // フォーム項目の初期値をuseStateで管理
    const [formData, {handleFormData}] = useForm({
        'uuid': props.match.params.uuid,
        'password': null
    });
    // Auth hooksの呼び出し
    const {errorMessage, handleChangePassword } = useAuth('/api/user/auth', 'user');
    // リダイレクト用の関数呼び出し
    const history = useHistory();

    return (
        <main className={styles.mt_40}>
            <Suspense fallback={<CircularProgress disableShrink />}>
                { errorMessage && errorMessage.httpRequestError && 
                    <Text className={styles.http_error}>{errorMessage.httpRequestError}</Text> 
                }
                <Heading tag={'h1'} tag_style={'h1'} className={styles.section_title}>
                    パスワード変更
                </Heading>
                <div className={styles.login_area}>
                    <form onSubmit={ e => {
                        e.preventDefault();
                        handleChangePassword({
                            url: `/api/user/resetPasswords/change`, 
                            form: formData,
                            callback: () => history.push('/user/login')
                        });
                    }}>
                        <FormInputText
                            name={'password'}
                            type={'password'}
                            onBlur={handleFormData}
                            value={formData.password}
                            label={'パスワード'}
                            error={errorMessage}
                            placeholder='半角英数字8文字以上'
                            className={styles.mb_16}
                        />
                        <Button size='l' color='primary' type="submit" className={styles.mb_8}>
                            パスワード変更
                        </Button>
                    </form>
                </div>
            </Suspense>
        </main>
    );
}

export default UserChangePassword;
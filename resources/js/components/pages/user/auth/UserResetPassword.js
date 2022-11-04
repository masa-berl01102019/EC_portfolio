import { CircularProgress } from '@material-ui/core';
import React, { Suspense } from 'react';
import useAuth from "../../../hooks/useAuth";
import useForm from '../../../hooks/useForm';
import { authUserState } from '../../../store/authState';
import { useSetRecoilState } from 'recoil';
import Heading from '../../../atoms/Heading/Heading';
import FormInputText from '../../../molecules/Form/FormInputText';
import Button from '../../../atoms/Button/Button';
import styles from '../styles.module.css';

function UserResetPassword() {
    // グローバルステートの呼び出し
    const setIsUserLogin = useSetRecoilState(authUserState);
    // フォーム項目の初期値をuseStateで管理
    const [formData, {handleFormData}] = useForm({
        'email': 'taichi06@example.org'
    });
    // Auth hooksの呼び出し
    const {errorMessage, handleResetPasswordEmail } = useAuth('/api/user/auth', 'user');

    return (
        <main className={styles.mt_40}>
            <Suspense fallback={<CircularProgress disableShrink />}>
                <Heading tag={'h1'} tag_style={'h1'} className={styles.section_title}>
                    パスワードリセット
                </Heading>
                <div className={styles.login_area}>
                    <form onSubmit={ e => {
                        e.preventDefault();
                        handleResetPasswordEmail({
                            url: `/api/user/resetPasswords/send`, 
                            form: formData,
                            callback: () => setIsUserLogin(false)
                        });
                    }}>
                        <FormInputText
                            name={'email'}
                            type='email'
                            onBlur={handleFormData}
                            value={formData.email}
                            label={'メールアドレス'}
                            error={errorMessage}
                            placeholder='080-1234-5678'
                            className={styles.mb_16}
                        />
                        <Button size='l' color='primary' type="submit" className={styles.mb_8}>
                            メールを送信
                        </Button>
                    </form>
                </div>
            </Suspense>
        </main>
    );
}

export default UserResetPassword;




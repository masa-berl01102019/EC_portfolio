import { CircularProgress } from '@material-ui/core';
import React, { Suspense } from 'react';
import useAuth from "../../../hooks/useAuth";
import useForm from '../../../hooks/useForm';
import { authUserState } from '../../../store/authState';
import { useSetRecoilState } from 'recoil';
import Text from '../../../atoms/Text/Text';
import Heading from '../../../atoms/Heading/Heading';
import FormInputText from '../../../molecules/Form/FormInputText';
import Button from '../../../atoms/Button/Button';
import styles from '../styles.module.css';
import {Link} from "react-router-dom";
import LinkBtn from '../../../atoms/LinkButton/LinkBtn';

function UserLogin() {
    // グローバルステートの呼び出し
    const setIsUserLogin = useSetRecoilState(authUserState);
    // フォーム項目の初期値をuseStateで管理
    const [formData, {handleFormData}] = useForm({
        'email': 'nanami72@example.org', 
        'password': 'abc12345', 
    });
    // Auth hooksの呼び出し
    const {errorMessage, handleLogin} = useAuth('/api/user/auth', 'user');

    return (
        <main className={styles.mt_40}>
            <Suspense fallback={<CircularProgress disableShrink />}>
                <Heading tag={'h1'} tag_style={'h1'} className={styles.section_title}>
                    ログイン
                </Heading>
                <div className={styles.login_area}>
                    <form onSubmit={ e => {
                        e.preventDefault();
                        handleLogin({
                            url: `/api/user/login`, 
                            form: formData,
                            callback: () => setIsUserLogin(true)
                        });
                    }}>
                        <FormInputText
                            name={'email'}
                            type='email'
                            onChange={handleFormData}
                            value={formData.email}
                            label={'メールアドレス'}
                            error={errorMessage}
                            placeholder='080-1234-5678'
                            className={styles.mb_16}
                        />
                        <FormInputText
                            name={'password'}
                            type='password'
                            onChange={handleFormData}
                            value={formData.password}
                            label={'パスワード'}
                            error={errorMessage}
                            placeholder='半角英数字8文字以上'
                            className={styles.mb_24}
                        />
                        <Button size='l' color='primary' type="submit" className={styles.mb_8}>ログイン</Button>
                        <Link to={'/user/reset_password'}>
                            <Text size='s' className={[styles.text_underline, styles.mb_32].join(' ')}>
                                パスワードをお忘れの方
                            </Text>
                        </Link>
                    </form>
                    <div>
                        <Heading tag={'h1'} tag_style={'h1'} className={[styles.title, styles.mb_8, styles.mt_8].join(' ')}>
                            初めてご利用の方
                        </Heading>
                        <Text size='s' className={styles.mb_24}>
                            初めてご利用のお客様は、こちらから会員登録を行ってください。
                        </Text>
                        <LinkBtn size='l' color='accent' to={`/users/create`} className={styles.mb_8} >新規会員登録</LinkBtn>
                    </div>
                </div>
            </Suspense>
        </main>
    );
}

export default UserLogin;




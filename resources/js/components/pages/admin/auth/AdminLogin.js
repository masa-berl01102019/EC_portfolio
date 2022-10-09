import { CircularProgress } from '@material-ui/core';
import React, {Suspense} from 'react';
import useForm from '../../../hooks/useForm';
import { authAdminState } from '../../../store/authState';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { menuAdminState } from '../../../store/menuState';
import useAuth from "../../../hooks/useAuth";
import Text from '../../../atoms/Text/Text';
import Heading from '../../../atoms/Heading/Heading';
import FormInputText from '../../../molecules/Form/FormInputText';
import Button from '../../../atoms/Button/Button';
import styles from '../styles.module.css';

function AdminLogin() {
    // グローバルステートの呼び出し
    const setIsAdminLogin = useSetRecoilState(authAdminState);
    // フォーム項目の初期値をuseStateで管理
    const [formData, {handleFormData}] = useForm({
        'email': 'msakamoto@example.net', 
        'password': 'abc12345', 
    });
    // Auth hooksの呼び出し
    const {errorMessage, handleLogin} = useAuth('/api/admin/auth', 'admin');
    // menuの状態管理
    const openAdminMenu = useRecoilValue(menuAdminState);

    return (
        <main>
            <Suspense fallback={<CircularProgress disableShrink />}>

                { errorMessage && errorMessage.httpRequestError && 
                    <Text className={styles.http_error}>{errorMessage.httpRequestError}</Text> 
                }

                <div className={ openAdminMenu ? [styles.container_open_menu, styles.login_max_content].join(' ') : [styles.container, styles.login_max_content].join(' ') }>
                    <div className={styles.form_area} style={{'marginTop' : '140px'}}>
                        <Heading tag={'h1'} tag_style={'h1'} className={[styles.mb_24, styles.text_center].join(' ')}>
                            管理者ログイン
                        </Heading>
                        <form onSubmit={ e => {
                            e.preventDefault();
                            handleLogin({
                                url: '/api/admin/login', 
                                form: formData,
                                callback: () => setIsAdminLogin(true)
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
                            <FormInputText
                                name={'password'}
                                type='password'
                                onBlur={handleFormData}
                                value={formData.password}
                                label={'パスワード'}
                                error={errorMessage}
                                placeholder='半角英数字8文字以上'
                                className={styles.mb_24}
                            />
                            <Button size='l' color='primary' type="submit" className={[styles.mb_8, styles.w_100].join(' ')}>ログイン</Button>
                        </form>
                    </div>
                </div>
            </Suspense>
        </main>
    );
}

export default AdminLogin;




import { CircularProgress } from '@material-ui/core';
import React, { Suspense } from 'react';
import useAuth from "../../../hooks/useAuth";
import useForm from '../../../hooks/useForm';
import { authAdminState } from '../../../store/authState';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { menuAdminState } from '../../../store/menuState';
import Text from '../../../atoms/Text/Text';
import Heading from '../../../atoms/Heading/Heading';
import FormInputText from '../../../molecules/Form/FormInputText';
import Button from '../../../atoms/Button/Button';
import styles from '../styles.module.css';

function AdminResetPassword() {
    // グローバルステートの呼び出し
    const setIsAdminLogin = useSetRecoilState(authAdminState);
    // フォーム項目の初期値をuseStateで管理
    const [formData, {handleFormData}] = useForm({
        'email': 'fwakamatsu@example.net'
    });
    // Auth hooksの呼び出し
    const {errorMessage, handleResetPasswordEmail } = useAuth('/api/admin/auth', 'admin');
    // menuの状態管理
    const openAdminMenu = useRecoilValue(menuAdminState);

    return (
        <main className={styles.mt_40}>
            <Suspense fallback={<CircularProgress disableShrink />}>

                { errorMessage && errorMessage.httpRequestError && 
                    <Text className={styles.http_error}>{errorMessage.httpRequestError}</Text> 
                }

                <div className={ openAdminMenu ? [styles.container_open_menu, styles.login_max_content].join(' ') : [styles.container, styles.login_max_content].join(' ') }>
                    <div className={styles.form_area} style={{'marginTop' : '140px'}}>
                        <Heading tag={'h1'} tag_style={'h1'} className={[styles.mb_24, styles.text_center].join(' ')}>
                            管理者パスワードリセット
                        </Heading>
                        <form onSubmit={ e => {
                            e.preventDefault();
                            handleResetPasswordEmail({
                                url: `/api/admin/resetPasswords/send`, 
                                form: formData,
                                callback: () => setIsAdminLogin(false)
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
                                className={styles.mb_24}
                            />
                            <Button size='l' color='primary' type="submit" className={[styles.mb_24, styles.w_100].join(' ')}>
                                メールを送信
                            </Button>
                        </form>
                    </div>
                </div>
            </Suspense>
        </main>
    );
}

export default AdminResetPassword;




import { CircularProgress } from '@material-ui/core';
import {useHistory} from "react-router-dom";
import React, { Suspense } from 'react';
import { useRecoilValue } from 'recoil';
import { menuAdminState } from '../../../store/menuState';
import useAuth from "../../../hooks/useAuth";
import useForm from '../../../hooks/useForm';
import Text from '../../../atoms/Text/Text';
import Heading from '../../../atoms/Heading/Heading';
import FormInputText from '../../../molecules/Form/FormInputText';
import Button from '../../../atoms/Button/Button';
import styles from '../styles.module.css';

function AdminChangePassword(props) {

    // フォーム項目の初期値をuseStateで管理
    const [formData, {handleFormData}] = useForm({
        'uuid': props.match.params.uuid,
        'password': null
    });
    // Auth hooksの呼び出し
    const {errorMessage, handleChangePassword } = useAuth('/api/admin/auth', 'admin');
    // リダイレクト用の関数呼び出し
    const history = useHistory();
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
                            管理者パスワード変更
                        </Heading>
                        <form onSubmit={ e => {
                            e.preventDefault();
                            handleChangePassword({
                                url: `/api/admin/resetPasswords/change`, 
                                form: formData,
                                callback: () => history.push('/admin/login')
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
                                className={styles.mb_24}
                            />
                            <Button size='l' color='primary' type="submit" className={[styles.mb_24, styles.w_100].join(' ')}>
                                パスワード変更
                            </Button>
                        </form>
                    </div>
                </div>
            </Suspense>
        </main>
    );
}

export default AdminChangePassword;
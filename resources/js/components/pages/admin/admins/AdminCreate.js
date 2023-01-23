import React, {Suspense} from 'react';
import {useHistory} from "react-router-dom";
import {CircularProgress} from "@material-ui/core";
import useFetchApiData from "../../../hooks/useFetchApiData";
import useForm from "../../../hooks/useForm";
import FormInputText from '../../../molecules/Form/FormInputText';
import Button from '../../../atoms/Button/Button';
import Heading from '../../../atoms/Heading/Heading';
import Text from '../../../atoms/Text/Text';
import styles from '../styles.module.css';
import LinkBtn from '../../../atoms/LinkButton/LinkBtn';
import { useRecoilValue } from 'recoil';
import { menuAdminState } from '../../../store/menuState';

function AdminCreate() {
    // urlの設定
    const baseUrl = '/api/admin/admins/create';
    // paramsの適用範囲を決めるscope名を定義
    const model = 'ADMIN';
    // APIと接続して返り値を取得
    const {data, errorMessage, createData} = useFetchApiData(baseUrl, model);
    // フォーム項目の初期値をuseStateで管理
    const [formData, {handleFormData}] = useForm({
        'last_name': null,
        'first_name': null,
        'last_name_kana': null,
        'first_name_kana': null,
        'tel': null,
        'email': null,
        'password': null,
    });
    // リダイレクト用の関数呼び出し
    const history = useHistory();
    // menuの状態管理
    const openAdminMenu = useRecoilValue(menuAdminState);


    return (
        <main>
            <Suspense fallback={<CircularProgress disableShrink />}>
                <div className={ openAdminMenu ? [styles.container_open_menu, styles.max_content].join(' ') : [styles.container, styles.max_content].join(' ') }>
                    <Heading tag={'h1'} tag_style={'h1'} className={styles.mb_16}>管理者新規登録</Heading>
                    <div className={styles.form_area}>
                        <form onSubmit={ e => {
                            e.preventDefault();
                            createData({ 
                                form: formData, 
                                url:'/api/admin/admins',
                                callback: () => history.push('/admin/admins')
                            });
                        }}>
                            <Text className={styles.mb_8}>氏名</Text>
                            <div className={[styles.flex, styles.mb_16].join(' ')}>
                                <FormInputText
                                    name={'last_name'}
                                    onBlur={handleFormData}
                                    value={formData.last_name}
                                    error={errorMessage}
                                    placeholder='山田'
                                    className={[styles.mr_24, styles.flex_basis_50].join(' ')}
                                />
                                <FormInputText
                                    name={'first_name'}
                                    onBlur={handleFormData}
                                    value={formData.first_name}
                                    error={errorMessage}
                                    placeholder='太郎'
                                    className={styles.flex_basis_50}
                                />
                            </div>
                            <Text className={styles.mb_8}>氏名(カナ)</Text>
                            <div className={[styles.flex, styles.mb_16].join(' ')}>
                                <FormInputText 
                                    name={'last_name_kana'} 
                                    onBlur={handleFormData} 
                                    value={formData.last_name_kana} 
                                    error={errorMessage} 
                                    placeholder='ヤマダ'
                                    className={[styles.mr_24, styles.flex_basis_50].join(' ')}
                                />
                                <FormInputText
                                    name={'first_name_kana'}
                                    onBlur={handleFormData}
                                    value={formData.first_name_kana}
                                    error={errorMessage}
                                    placeholder='タロウ'
                                    className={styles.flex_basis_50}
                                />
                            </div>
                            <FormInputText
                                name={'tel'}
                                type='tel'
                                onBlur={handleFormData}
                                value={formData.tel}
                                label={'電話番号'}
                                error={errorMessage}
                                placeholder='080-1234-5678'
                                className={styles.mb_16}
                            />
                            <FormInputText
                                name={'email'}
                                type={'email'}
                                onBlur={handleFormData}
                                value={formData.email}
                                label={'メールアドレス'}
                                error={errorMessage}
                                placeholder='test@example.com'
                                className={styles.mb_16}
                            />
                            <FormInputText
                                name={'password'}
                                type={'password'}
                                onBlur={handleFormData}
                                value={formData.password}
                                label={'パスワード'}
                                error={errorMessage}
                                placeholder='半角英数字8文字以上'
                                className={styles.mb_40}
                            />
                            <div className={[styles.flex, styles.justify_center].join(' ')}>
                                <LinkBtn to={`/admin/admins`} size='l' className={styles.mr_12} style={{'width': '100%'}}>一覧に戻る</LinkBtn>
                                <Button size='l' color='primary' type="submit" className={[styles.ml_12, styles.w_100].join(' ')}>新規登録</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </Suspense>
        </main>
    );
}

export default AdminCreate;

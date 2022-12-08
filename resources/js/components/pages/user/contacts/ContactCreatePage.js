import React, { Suspense, useState } from 'react';
import {useHistory} from "react-router-dom";
import useFetchApiData from "../../../hooks/useFetchApiData";
import {CircularProgress} from "@material-ui/core";
import useForm from "../../../hooks/useForm";
import FormInputText from '../../../molecules/Form/FormInputText';
import FormInputTextarea from '../../../molecules/Form/FormInputTextarea';
import Button from '../../../atoms/Button/Button';
import Heading from '../../../atoms/Heading/Heading';
import Text from '../../../atoms/Text/Text';
import styles from '../styles.module.css';
import LinkBtn from '../../../atoms/LinkButton/LinkBtn';
import LoadingPopup from '../../../molecules/Popup/LoadingPopup';
import useValidation from '../../../hooks/useValidation';


function ContactCreatePage() {
    // urlの設定
    const baseUrl = `/api/user/contacts`;
    // paramsの適用範囲を決めるscope名を定義
    const model = 'CONTACT';
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
        'title': null, 
        'body': null, 
    });
    // フロント用バリデーション
    const {valid, setValid, validation} = useValidation(formData, 'user', 'contact_request');
    // リダイレクト用の関数呼び出し
    const history = useHistory();
    // ローディングステータスの状態管理
    const [isLoading, setIsLoading] = useState(false);

    return (
        <main className={styles.mt_40}>
            <Suspense fallback={<CircularProgress disableShrink />}>
                { isLoading && !errorMessage && <LoadingPopup isOpen={isLoading}>お問い合わせ中</LoadingPopup> }
                <Heading tag={'h1'} tag_style={'h1'} className={styles.section_title}>
                    お問い合わせ
                </Heading>
                <div className={styles.form_contents_area}>
                    <form onSubmit={ e => {
                        e.preventDefault();
                        if(validation.fails()) {
                            setValid(true);
                        } else {
                            setIsLoading(true);
                            createData({
                                form: formData,
                                url:'/api/user/contacts',
                                callback: () => history.push('/contacts/complete')
                            });
                        }
                    }}>
                        <Text className={styles.mb_8}>氏名</Text>
                        <div className={[styles.flex, styles.mb_16].join(' ')}>
                            <FormInputText
                                name={'last_name'}
                                onChange={handleFormData}
                                value={formData.last_name}
                                error={errorMessage}
                                validation={validation}
                                valid={valid}
                                placeholder='山田'
                                className={[styles.mr_24, styles.flex_basis_50].join(' ')}
                            />
                            <FormInputText
                                name={'first_name'}
                                onChange={handleFormData}
                                value={formData.first_name}
                                error={errorMessage}
                                validation={validation}
                                valid={valid}
                                placeholder='太郎'
                                className={styles.flex_basis_50}
                            />
                        </div>
                        <Text className={styles.mb_8}>氏名(カナ)</Text>
                        <div className={[styles.flex, styles.mb_16].join(' ')}>
                            <FormInputText 
                                name={'last_name_kana'} 
                                onChange={handleFormData} 
                                value={formData.last_name_kana} 
                                error={errorMessage}
                                validation={validation}
                                valid={valid}
                                placeholder='ヤマダ'
                                className={[styles.mr_24, styles.flex_basis_50].join(' ')}
                            />
                            <FormInputText
                                name={'first_name_kana'}
                                onChange={handleFormData}
                                value={formData.first_name_kana}
                                error={errorMessage}
                                validation={validation}
                                valid={valid}
                                placeholder='タロウ'
                                className={styles.flex_basis_50}
                            />
                        </div>
                        <FormInputText
                            name={'tel'}
                            type='tel'
                            onChange={handleFormData}
                            value={formData.tel}
                            label={'電話番号'}
                            error={errorMessage}
                            validation={validation}
                            valid={valid}
                            placeholder='080-1234-5678'
                            className={styles.mb_16}
                        />
                        <FormInputText
                            name={'email'}
                            type={'email'}
                            onChange={handleFormData}
                            value={formData.email}
                            label={'メールアドレス'}
                            error={errorMessage}
                            validation={validation}
                            valid={valid}
                            placeholder='test@example.com'
                            className={styles.mb_16}
                        />
                        <FormInputText
                            name={'title'}
                            onChange={handleFormData}
                            value={formData.title}
                            label={'タイトル'}
                            error={errorMessage}
                            validation={validation}
                            valid={valid}
                            placeholder='タイトルを入力'
                            className={styles.mb_16}
                        />
                        <FormInputTextarea
                            name={'body'} 
                            value={formData.body}
                            onChange={handleFormData} 
                            placeholder={'本文を入力'}
                            label={'本文'}
                            error={errorMessage}
                            validation={validation}
                            valid={valid}
                            className={styles.mb_40}
                            style={{'minHeight' : '250px'}}
                        />

                        <div className={[styles.flex, styles.justify_center].join(' ')}>
                            <LinkBtn to={`/`} className={[styles.mr_8, styles.btn_max].join(' ')} >キャンセル</LinkBtn>
                            <Button color='primary' type="submit" className={[styles.ml_8, styles.btn_max].join(' ')}>お問い合わせ</Button>
                        </div>
                    </form>
                </div>
            </Suspense>
        </main>
    );
}

export default ContactCreatePage;

import React, { Suspense } from 'react';
import {useHistory} from "react-router-dom";
import useFetchApiData2 from "../../../hooks/useFetchApiData2";
import {CircularProgress} from "@material-ui/core";
import useForm from "../../../hooks/useForm";
import FormInputText from '../../../molecules/Form/FormInputText';
import FormInputTextarea from '../../../molecules/Form/FormInputTextarea';
import Button from '../../../atoms/Button/Button';
import Heading from '../../../atoms/Heading/Heading';
import Text from '../../../atoms/Text/Text';
import styles from '../styles.module.css';
import LinkBtn from '../../../atoms/LinkButton/LinkBtn';

function ContactCreatePage() {
    // urlの設定
    const baseUrl = `/api/user/contacts`;
    // paramsの適用範囲を決めるscope名を定義
    const model = 'CONTACT';
    // APIと接続して返り値を取得
    const {data, errorMessage, createData} = useFetchApiData2(baseUrl, model);
    // フォーム項目の初期値をuseStateで管理
    const [formData, {setFormData, handleFormData}] = useForm({
        'last_name': null, 
        'first_name': null, 
        'last_name_kana': null, 
        'first_name_kana': null, 
        'tel': null, 
        'email': null, 
        'title': null, 
        'body': null, 
    });
    // リダイレクト用の関数呼び出し
    const history = useHistory();

    return (
        <main className={styles.mt_40}>
            <Suspense fallback={<CircularProgress disableShrink />}>
            {
                errorMessage && errorMessage.httpRequestError ? (
                    <Text className={styles.http_error}>{errorMessage.httpRequestError}</Text>
                ) : (
                    <>
                        <Heading tag={'h1'} tag_style={'h1'} className={styles.section_title}>
                            お問い合わせ
                        </Heading>
                        <div className={styles.form_contents_area}>
                            <form onSubmit={ e => {
                                e.preventDefault();
                                createData({
                                    form: formData,
                                    url:'/api/user/contacts',
                                    callback: () => history.push('/')
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
                                    name={'title'}
                                    onBlur={handleFormData}
                                    value={formData.title}
                                    label={'タイトル'}
                                    error={errorMessage}
                                    placeholder='タイトルを入力'
                                    className={styles.mb_16}
                                />
                                <FormInputTextarea
                                    name={'body'} 
                                    value={formData.body}
                                    onBlur={handleFormData} 
                                    placeholder={'本文を入力'}
                                    label={'本文'}
                                    error={errorMessage}
                                    className={styles.mb_40}
                                    style={{'minHeight' : '250px'}}
                                />

                                <div className={[styles.flex, styles.justify_center].join(' ')}>
                                    <LinkBtn to={`/`} className={[styles.mr_8, styles.btn_max].join(' ')} >キャンセル</LinkBtn>
                                    <Button color='primary' type="submit" className={[styles.ml_8, styles.btn_max].join(' ')}>お問い合わせ</Button>
                                </div>
                            </form>
                        </div>
                    </>
                )
            }
            </Suspense>
        </main>
    );
}

export default ContactCreatePage;

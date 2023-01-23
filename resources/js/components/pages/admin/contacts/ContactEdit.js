import React, {Suspense} from 'react';
import {useHistory} from "react-router-dom";
import useFetchApiData from "../../../hooks/useFetchApiData";
import {CircularProgress} from "@material-ui/core";
import useForm from "../../../hooks/useForm";
import Heading from '../../../atoms/Heading/Heading';
import FormSelectbox from '../../../molecules/Form/FormSelectbox';
import Button from '../../../atoms/Button/Button';
import Text from '../../../atoms/Text/Text';
import styles from '../styles.module.css';
import LinkBtn from '../../../atoms/LinkButton/LinkBtn';
import { menuAdminState } from '../../../store/menuState';
import { useRecoilValue } from 'recoil';
import FormInputTextarea from '../../../molecules/Form/FormInputTextarea';
import useValidation from '../../../hooks/useValidation';

function ContactEdit(props) {
    // urlの設定
    const baseUrl = `/api/admin/contacts/${props.match.params.id}/edit`;
    // paramsの適用範囲を決めるscope名を定義
    const model = 'CONTACT';
    // APIと接続して返り値を取得
    const {data, errorMessage, updateData} = useFetchApiData(baseUrl, model);
    // フォーム項目の初期値をuseStateで管理
    const [formData, {handleFormData}] = useForm(data.contact);
    // フロント用バリデーション
    const {valid, setValid, validation, errorObject} = useValidation(formData, 'admin', 'contact_request');
    // リダイレクト用の関数呼び出し
    const history = useHistory();
    // menuの状態管理
    const openAdminMenu = useRecoilValue(menuAdminState);

    
    return (
        <main>
            <Suspense fallback={<CircularProgress disableShrink />}>
                <div className={ openAdminMenu ? [styles.container_open_menu, styles.max_content].join(' ') : [styles.container, styles.max_content].join(' ') }>
                    <Heading tag={'h1'} tag_style={'h1'} className={styles.mb_16}>お問い合わせ編集</Heading>
                    <div className={styles.form_area}>
                        <form onSubmit={ e => {
                            e.preventDefault();
                            if(validation.fails()) {
                                setValid(true);
                                return false;
                            }
                            updateData({
                                form: formData, 
                                url: `/api/admin/contacts/${props.match.params.id}`,
                                callback: () => history.push('/admin/contacts')
                            });
                        }}>
                            <Heading tag={'h2'} tag_style={'h3'} className={styles.contents_header}>お問い合わせ情報</Heading>
                            <div className={styles.contents_body}>
                                <Text className={styles.mb_4}>氏名: {formData.full_name && formData.full_name_kana && (`${formData.full_name}(${formData.full_name_kana})`)}</Text>
                                <Text className={styles.mb_4}>TEL: {formData.tel}</Text>
                                <Text className={styles.mb_4}>Email: {formData.email}</Text>
                                <Text>お問い合わせ日: {formData.created_at}</Text>
                            </div>

                            <Heading tag={'h2'} tag_style={'h3'} className={styles.contents_header}>タイトル</Heading>
                            <Text className={styles.contents_body}>{formData.title}</Text>
                            <Heading tag={'h2'} tag_style={'h3'} className={styles.contents_header}>お問い合わせ内容</Heading>
                            <Text className={styles.contents_body}>{formData.body}</Text>

                            <FormInputTextarea
                                name={'memo'} 
                                value={formData.memo} 
                                onChange={handleFormData} 
                                placeholder={'本文を入力'}
                                label={'備考記入欄'}
                                error={errorMessage}
                                validation={validation}
                                valid={valid}
                                className={styles.mb_16}
                                style={{'minHeight' : '148px'}}
                            />

                            <FormSelectbox
                                name='response_status'
                                value={formData.response_status}
                                onChange={handleFormData}
                                label={'対応状況'}
                                error={errorMessage}
                                validation={validation}
                                valid={valid}
                                className={styles.mb_40}
                            >
                                <option value={0}>未対応</option>
                                <option value={1}>対応中</option>
                                <option value={2}>対応済</option>
                            </FormSelectbox>
                            
                            <div className={[styles.flex, styles.justify_center].join(' ')}>
                                <LinkBtn to={`/admin/contacts`} size='l' className={styles.mr_12} style={{'width': '100%'}} >一覧に戻る</LinkBtn>
                                <Button size='l' color='primary' type="submit" className={[styles.ml_12, styles.w_100].join(' ')}>更新する</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </Suspense>
        </main>
    );
}

export default ContactEdit;

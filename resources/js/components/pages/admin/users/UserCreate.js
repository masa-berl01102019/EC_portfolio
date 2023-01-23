import React, {Suspense, useState} from 'react';
import {useHistory} from "react-router-dom";
import useFetchApiData from "../../../hooks/useFetchApiData";
import {CircularProgress} from "@material-ui/core";
import useForm from "../../../hooks/useForm";
import FormInputText from '../../../molecules/Form/FormInputText';
import Button from '../../../atoms/Button/Button';
import LinkBtn from '../../../atoms/LinkButton/LinkBtn';
import Heading from '../../../atoms/Heading/Heading';
import InputCheckbox from '../../../atoms/InputCheckbox/InputCheckbox';
import Text from '../../../atoms/Text/Text';
import styles from '../styles.module.css';
import { useRecoilValue } from 'recoil';
import { menuAdminState } from '../../../store/menuState';
import FormInputRadio from '../../../molecules/Form/FormInputRadio';
import FormDatePicker from '../../../molecules/Form/FormDatePicker';

function UserCreate() {
    // urlの設定
    const baseUrl = '/api/admin/users/create';
    // paramsの適用範囲を決めるscope名を定義
    const model = 'USER';
    // APIと接続して返り値を取得
    const {data, errorMessage, createData} = useFetchApiData(baseUrl, model);
    // チェックボックスのclickイベントで配送先住所のフォームの表示と非表示を管理
    const [open, setOpen] = useState(false);
    // フォーム項目の初期値をuseStateで管理
    const [formData, {handleFormData, handleFormDate}] = useForm({
        'last_name': null,
        'first_name': null,
        'last_name_kana': null,
        'first_name_kana': null,
        'gender': null, // 0:man 1:woman 2:others 3:no answer
        'birthday': null,
        'post_code': null,
        'prefecture': null,
        'municipality': null,
        'street_name': null,
        'street_number': null,
        'building': null,
        'delivery_post_code': null,
        'delivery_prefecture': null,
        'delivery_municipality': null,
        'delivery_street_name': null,
        'delivery_street_number': null,
        'delivery_building': null,
        'tel': null,
        'email': null,
        'password': null,
        'is_received': null, // 0: 受取NG 1: 受取OK
    });
    // リダイレクト用の関数呼び出し
    const history = useHistory();
    // menuの状態管理
    const openAdminMenu = useRecoilValue(menuAdminState);

    return (
        <main>
            <Suspense fallback={<CircularProgress disableShrink />}>
                <div className={ openAdminMenu ? [styles.container_open_menu, styles.max_content].join(' ') : [styles.container, styles.max_content].join(' ') }>
                    <Heading tag={'h1'} tag_style={'h1'} className={styles.mb_16}>会員新規登録</Heading>
                    <div className={styles.form_area}>
                        <form onSubmit={ e => {
                            e.preventDefault();
                            createData({ 
                                form: formData, 
                                url:'/api/admin/users',
                                callback: () => history.push('/admin/users')
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
                            <Text className={styles.mb_8}>性別</Text>
                            <div className={styles.mb_16}>
                                <div className={styles.flex}>
                                    <FormInputRadio
                                        name='gender' 
                                        value={0} 
                                        onChange={handleFormData}
                                        checked={formData.gender == 0}
                                        label='男性'
                                        className={styles.mr_8}
                                        error={errorMessage}
                                    />
                                    <FormInputRadio
                                        name='gender' 
                                        value={1} 
                                        onChange={handleFormData}
                                        checked={formData.gender == 1}
                                        label='女性'
                                        className={styles.mr_8}
                                        error={errorMessage}
                                    />
                                    <FormInputRadio
                                        name='gender' 
                                        value={2} 
                                        onChange={handleFormData}
                                        checked={formData.gender == 2}
                                        label='その他'
                                        className={styles.mr_8}
                                        error={errorMessage}
                                    />
                                    <FormInputRadio
                                        name='gender' 
                                        value={3} 
                                        onChange={handleFormData}
                                        checked={formData.gender == 3}
                                        label='未回答'
                                        error={errorMessage}
                                    />
                                </div>
                                { errorMessage && <Text role='error' size='s' className={styles.mt_8}>{errorMessage.gender}</Text> }
                            </div>
                            <FormDatePicker
                                name={'birthday'} 
                                value={formData.birthday} 
                                onChange={handleFormDate} 
                                label={'生年月日'} 
                                className={styles.mb_16} 
                                error={errorMessage}
                            />
                            <FormInputText
                                name={'post_code'}
                                type={'number'}
                                onBlur={handleFormData}
                                value={formData.post_code}
                                label={'郵便番号'}
                                error={errorMessage}
                                placeholder='1234567'
                                className={styles.mb_16}
                            />
                            <FormInputText
                                name={'prefecture'}
                                onBlur={handleFormData}
                                value={formData.prefecture}
                                label={'都道府県'}
                                error={errorMessage}
                                placeholder='神奈川県'
                                className={styles.mb_16}
                            />
                            <FormInputText
                                name={'municipality'}
                                onBlur={handleFormData}
                                value={formData.municipality}
                                label={'市区町村郡'}
                                error={errorMessage}
                                placeholder='川崎市麻生区'
                                className={styles.mb_16}
                            />
                            <FormInputText
                                name={'street_name'}
                                onBlur={handleFormData}
                                value={formData.street_name}
                                label={'町名'}
                                error={errorMessage}
                                placeholder='千代ヶ丘'
                                className={styles.mb_16}
                            />
                            <FormInputText
                                name={'street_number'}
                                onBlur={handleFormData}
                                value={formData.street_number}
                                label={'町目番地'}
                                error={errorMessage}
                                placeholder='1-1-1'
                                className={styles.mb_16}
                            />
                            <FormInputText
                                name={'building'}
                                onBlur={handleFormData}
                                value={formData.building}
                                label={'建物名'}
                                error={errorMessage}
                                placeholder='○☓△ビルディング 1F'
                                className={styles.mb_16}
                            />
                            <label className={styles.delivery_address_check}>
                                <InputCheckbox onChange={() => { setOpen(!open)}} checked={open} />
                                <Text className={styles.ml_8}>配送先に別の住所を指定する</Text>
                            </label>
                            <div className={open? styles.block : styles.hidden}>
                                <FormInputText
                                    name={'delivery_post_code'}
                                    type={'number'}
                                    onBlur={handleFormData}
                                    value={formData.delivery_post_code}
                                    label={'郵便番号'}
                                    error={errorMessage}
                                    placeholder='1234567'
                                    className={styles.mb_16}
                                />
                                <FormInputText
                                    name={'delivery_prefecture'}
                                    onBlur={handleFormData}
                                    value={formData.delivery_prefecture}
                                    label={'都道府県'}
                                    error={errorMessage}
                                    placeholder='神奈川県'
                                    className={styles.mb_16}
                                />
                                <FormInputText
                                    name={'delivery_municipality'}
                                    onBlur={handleFormData}
                                    value={formData.delivery_municipality}
                                    label={'市区町村郡'}
                                    error={errorMessage}
                                    placeholder='川崎市麻生区'
                                    className={styles.mb_16}
                                />
                                <FormInputText
                                    name={'delivery_street_name'}
                                    onBlur={handleFormData}
                                    value={formData.delivery_street_name}
                                    label={'町名'}
                                    error={errorMessage}
                                    placeholder='千代ヶ丘'
                                    className={styles.mb_16}
                                />
                                <FormInputText
                                    name={'delivery_street_number'}
                                    onBlur={handleFormData}
                                    value={formData.delivery_street_number}
                                    label={'町目番地'}
                                    error={errorMessage}
                                    placeholder='1-1-1'
                                    className={styles.mb_16}
                                />
                                <FormInputText
                                    name={'delivery_building'}
                                    onBlur={handleFormData}
                                    value={formData.delivery_building}
                                    label={'建物名'}
                                    error={errorMessage}
                                    placeholder='○☓△ビルディング 1F'
                                    className={styles.mb_16}
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
                                className={styles.mb_16}
                            />
                            <Text className={styles.mb_8}>DM登録</Text>
                            <div className={styles.mb_40}>
                                <div className={styles.flex}>
                                    <FormInputRadio
                                        name='is_received' 
                                        value={1} 
                                        onChange={handleFormData}
                                        checked={formData.is_received == 1}
                                        label='登録する'
                                        error={errorMessage}
                                    />
                                    <FormInputRadio
                                        name='is_received' 
                                        value={0} 
                                        onChange={handleFormData}
                                        checked={formData.is_received == 0}
                                        label='登録しない'
                                        className={styles.ml_32}
                                        error={errorMessage}
                                    />
                                </div>
                                { errorMessage && <Text role='error' size='s' className={styles.mt_8}>{errorMessage.is_received}</Text> }
                            </div>
                            <div className={[styles.flex, styles.justify_center].join(' ')}>
                                <LinkBtn to={`/admin/users`} size='l' className={styles.mr_12} style={{'width': '100%'}} >一覧に戻る</LinkBtn>
                                <Button size='l' color='primary' type="submit" className={[styles.ml_12, styles.w_100].join(' ')}>新規登録</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </Suspense>
        </main>
    );
}

export default UserCreate;
import React, {Suspense, useState} from 'react';
import {useHistory} from "react-router-dom";
import useFetchApiData from "../../../hooks/useFetchApiData";
import {CircularProgress} from "@material-ui/core";
import useForm from "../../../hooks/useForm";
import FormInputText from '../../../molecules/Form/FormInputText';
import Button from '../../../atoms/Button/Button';
import Heading from '../../../atoms/Heading/Heading';
import InputCheckbox from '../../../atoms/InputCheckbox/InputCheckbox';
import Text from '../../../atoms/Text/Text';
import styles from '../styles.module.css';
import LinkBtn from '../../../atoms/LinkButton/LinkBtn';
import { useRecoilValue } from 'recoil';
import { menuAdminState } from '../../../store/menuState';
import FormInputRadio from '../../../molecules/Form/FormInputRadio';
import FormDatePicker from '../../../molecules/Form/FormDatePicker';
import useValidation from '../../../hooks/useValidation';

function UserEdit(props) {
    // urlの設定 * propsで渡ってきたIDを初期URLにセット
    const baseUrl = `/api/admin/users/${props.match.params.id}/edit`;
    // paramsの適用範囲を決めるscope名を定義
    const model = 'USER';
    // APIと接続して返り値を取得
    const {data, errorMessage, updateData} = useFetchApiData(baseUrl, model);
    // チェックボックスのclickイベントで配送先住所のフォームの表示と非表示を管理
    const [open, setOpen] = useState(false);
    // フォーム項目の初期値をuseStateで管理
    const [formData, {handleFormData, handleFormDate}] = useForm(data.user);
    // フロント用バリデーション
    const {valid, setValid, validation} = useValidation(formData, 'admin', 'user_edit');
    // リダイレクト用の関数呼び出し
    const history = useHistory();
    // menuの状態管理
    const openAdminMenu = useRecoilValue(menuAdminState);
    
    return (
        <main>
            <Suspense fallback={<CircularProgress disableShrink />}>
                <div className={ openAdminMenu ? [styles.container_open_menu, styles.max_content].join(' ') : [styles.container, styles.max_content].join(' ') }>
                    <Heading tag={'h1'} tag_style={'h1'} className={styles.mb_16}>会員編集</Heading>
                    <div className={styles.form_area}>
                        <form onSubmit={ e => {
                            e.preventDefault();
                            if(validation.fails()) {
                                setValid(true);
                            } else {
                                updateData({
                                    form: formData, 
                                    url: `/api/admin/users/${props.match.params.id}`,
                                    callback: () => history.push('/admin/users')
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
                                { (valid && validation.fails() && validation.errors.first('gender')) && 
                                    <Text size='s' role='error' className={[styles.mt_8, styles.front_validation].join(' ')} >
                                        {validation.errors.first('gender')}
                                    </Text> 
                                }
                                { errorMessage && <Text role='error' size='s' className={styles.mt_8}>{errorMessage.gender}</Text> }
                            </div>
                            <FormDatePicker
                                name={'birthday'} 
                                value={formData.birthday} 
                                onChange={handleFormDate} 
                                label={'生年月日'} 
                                className={styles.mb_16} 
                                error={errorMessage}
                                validation={validation}
                                valid={valid}
                            />
                            <FormInputText
                                name={'post_code'}
                                type={'number'}
                                onChange={handleFormData}
                                value={formData.post_code}
                                label={'郵便番号'}
                                error={errorMessage}
                                validation={validation}
                                valid={valid}
                                placeholder='1234567'
                                className={styles.mb_16}
                            />
                            <FormInputText
                                name={'prefecture'}
                                onChange={handleFormData}
                                value={formData.prefecture}
                                label={'都道府県'}
                                error={errorMessage}
                                validation={validation}
                                valid={valid}
                                placeholder='神奈川県'
                                className={styles.mb_16}
                            />
                            <FormInputText
                                name={'municipality'}
                                onChange={handleFormData}
                                value={formData.municipality}
                                label={'市区町村郡'}
                                error={errorMessage}
                                validation={validation}
                                valid={valid}
                                placeholder='川崎市麻生区'
                                className={styles.mb_16}
                            />
                            <FormInputText
                                name={'street_name'}
                                onChange={handleFormData}
                                value={formData.street_name}
                                label={'町名'}
                                error={errorMessage}
                                validation={validation}
                                valid={valid}
                                placeholder='千代ヶ丘'
                                className={styles.mb_16}
                            />
                            <FormInputText
                                name={'street_number'}
                                onChange={handleFormData}
                                value={formData.street_number}
                                label={'丁目番地'}
                                error={errorMessage}
                                validation={validation}
                                valid={valid}
                                placeholder='1-1-1'
                                className={styles.mb_16}
                            />
                            <FormInputText
                                name={'building'}
                                onChange={handleFormData}
                                value={formData.building}
                                label={'建物名'}
                                error={errorMessage}
                                validation={validation}
                                valid={valid}
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
                                    onChange={handleFormData}
                                    value={formData.delivery_post_code}
                                    label={'郵便番号'}
                                    error={errorMessage}
                                    validation={validation}
                                    valid={valid}
                                    placeholder='1234567'
                                    className={styles.mb_16}
                                />
                                <FormInputText
                                    name={'delivery_prefecture'}
                                    onChange={handleFormData}
                                    value={formData.delivery_prefecture}
                                    label={'都道府県'}
                                    error={errorMessage}
                                    validation={validation}
                                    valid={valid}
                                    placeholder='神奈川県'
                                    className={styles.mb_16}
                                />
                                <FormInputText
                                    name={'delivery_municipality'}
                                    onChange={handleFormData}
                                    value={formData.delivery_municipality}
                                    label={'市区町村郡'}
                                    error={errorMessage}
                                    validation={validation}
                                    valid={valid}
                                    placeholder='川崎市麻生区'
                                    className={styles.mb_16}
                                />
                                <FormInputText
                                    name={'delivery_street_name'}
                                    onChange={handleFormData}
                                    value={formData.delivery_street_name}
                                    label={'町名'}
                                    error={errorMessage}
                                    validation={validation}
                                    valid={valid}
                                    placeholder='千代ヶ丘'
                                    className={styles.mb_16}
                                />
                                <FormInputText
                                    name={'delivery_street_number'}
                                    onChange={handleFormData}
                                    value={formData.delivery_street_number}
                                    label={'丁目番地'}
                                    error={errorMessage}
                                    validation={validation}
                                    valid={valid}
                                    placeholder='1-1-1'
                                    className={styles.mb_16}
                                />
                                <FormInputText
                                    name={'delivery_building'}
                                    onChange={handleFormData}
                                    value={formData.delivery_building}
                                    label={'建物名'}
                                    error={errorMessage}
                                    validation={validation}
                                    valid={valid}
                                    placeholder='○☓△ビルディング 1F'
                                    className={styles.mb_16}
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
                                { (valid && validation.fails() && validation.errors.first('is_received')) && 
                                    <Text size='s' role='error' className={[styles.mt_8, styles.front_validation].join(' ')} >
                                        {validation.errors.first('is_received')}
                                    </Text> 
                                }
                                { errorMessage && <Text role='error' size='s' className={styles.mt_8}>{errorMessage.is_received}</Text> }
                            </div>

                            <div className={[styles.flex, styles.justify_center].join(' ')}>
                                <LinkBtn to={`/admin/users`} size='l' className={styles.mr_12} style={{'width': '100%'}} >一覧に戻る</LinkBtn>
                                <Button size='l' color='primary' type="submit" className={[styles.ml_12, styles.w_100].join(' ')}>更新する</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </Suspense>
        </main>
    );
}

export default UserEdit;

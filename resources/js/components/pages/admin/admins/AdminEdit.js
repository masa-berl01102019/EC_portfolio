import React, {Suspense, useEffect} from 'react';
import {Link, useHistory} from "react-router-dom";
import {CircularProgress} from "@material-ui/core";
import useFetchApiData2 from "../../../hooks/useFetchApiData2";
import useForm from "../../../hooks/useForm";
import FormInputText from '../../../molecules/FormInputText/FormInputText';
import Badge from '../../../atoms/Badge/Badge';
import Button from '../../../atoms/Button/Button';
import Heading from '../../../atoms/Heading/Heading';
import Text from '../../../atoms/Text/Text';
import styles from '../styles.module.css';
import { useRecoilValue } from 'recoil';
import { menuAdminState } from '../../../store/menuState';
import LinkBtn from '../../../atoms/LinkButton/LinkBtn';

function AdminEdit(props) {
    // urlの設定 * propsで渡ってきたIDを初期URLにセット
    const baseUrl = `/api/admin/admins/${props.match.params.id}/edit`;
    // paramsの適用範囲を決めるscope名を定義
    const model = 'ADMIN';
    // APIと接続して返り値を取得
    const {data, errorMessage, updateData} = useFetchApiData2(baseUrl, model);
    // フォーム項目の初期値をuseStateで管理
    const [formData, {setFormData, handleFormData}] = useForm({
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

    useEffect(() => {
        // 非同期で通信されるので初回読み込み時にadminが入ってこない場合があるので条件分岐してあげる
        if(data.admin) {
            // フォームのデフォルト値を設定するためにsetFormDataで値をセット
            setFormData({...data.admin});
        }
    },[]);

    
    return (
        <main>
            <Suspense fallback={<CircularProgress disableShrink />}>
            {
                errorMessage && errorMessage.httpRequestError ? (
                    <Text role='error'>{errorMessage.httpRequestError}</Text>
                ) : (
                    <div className={ openAdminMenu ? [styles.container_open_menu, styles.max_content].join(' ') : [styles.container, styles.max_content].join(' ') }>
                        <Heading tag={'h1'} tag_style={'h1'} className={styles.mb_16}>管理者編集</Heading>
                        <div className={styles.form_area}>
                            <form onSubmit={ e => {
                                e.preventDefault();
                                updateData({
                                    form: formData, 
                                    url: `/api/admin/admins/${props.match.params.id}`,
                                    callback: () => history.push('/admin/admins')
                                });
                            }}>
                                <div className={styles.mb_16}>
                                    <div className={[styles.flex, styles.align_center, styles.mb_8].join(' ')} >
                                        <Text className={styles.mr_4}>氏名</Text>
                                        <Badge text='必須' />
                                    </div>
                                    <div className={styles.flex}>
                                        <div className={[styles.flex_basis_50, styles.mr_24].join(' ')}>
                                            <FormInputText
                                                name={'last_name'}
                                                onBlur={handleFormData}
                                                value={formData.last_name}
                                                error={errorMessage}
                                                placeholder='山田'
                                                style={{'width' : '100%'}}
                                            />
                                        </div>
                                        <div className={styles.flex_basis_50}>
                                            <FormInputText
                                                name={'first_name'}
                                                onBlur={handleFormData}
                                                value={formData.first_name}
                                                error={errorMessage}
                                                placeholder='太郎'
                                                style={{'width' : '100%'}}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.mb_16}>
                                    <div className={[styles.flex, styles.align_center, styles.mb_8].join(' ')} >
                                        <Text className={styles.mr_4}>氏名(カナ)</Text>
                                        <Badge text='必須' />
                                    </div>
                                    <div className={styles.flex}>
                                        <div className={[styles.flex_basis_50, styles.mr_24].join(' ')}>
                                            <FormInputText 
                                                name={'last_name_kana'} 
                                                onBlur={handleFormData} 
                                                value={formData.last_name_kana} 
                                                error={errorMessage} 
                                                placeholder='ヤマダ'
                                                style={{'width' : '100%'}}
                                            />
                                        </div>
                                        <div className={styles.flex_basis_50}>
                                            <FormInputText
                                                name={'first_name_kana'}
                                                onBlur={handleFormData}
                                                value={formData.first_name_kana}
                                                error={errorMessage}
                                                placeholder='タロウ'
                                                style={{'width' : '100%'}}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.mb_16}>
                                    <FormInputText
                                        name={'tel'}
                                        type='tel'
                                        onBlur={handleFormData}
                                        value={formData.tel}
                                        label={'電話番号'}
                                        error={errorMessage}
                                        placeholder='080-1234-5678'
                                        required={true}
                                    />
                                </div>
                                <div className={styles.mb_40}>
                                    <FormInputText
                                        name={'email'}
                                        type={'email'}
                                        onBlur={handleFormData}
                                        value={formData.email}
                                        label={'メールアドレス'}
                                        error={errorMessage}
                                        placeholder='test@example.com'
                                        required={true}
                                    />
                                </div>
                                <div className={[styles.flex, styles.align_center, styles.justify_center].join(' ')}>
                                    <LinkBtn to={`/admin/admins`} size='l' className={[styles.mr_12, styles.w_100].join(' ')} >一覧に戻る</LinkBtn>
                                    <Button size='l' color='primary' type="submit" className={[styles.ml_12, styles.w_100].join(' ')}>更新する</Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
            </Suspense>
        </main>
    );
}

export default AdminEdit;

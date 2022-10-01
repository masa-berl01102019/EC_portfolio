import React, {Suspense, useEffect} from 'react';
import {Link, useHistory} from "react-router-dom";
import useFetchApiData2 from "../../../hooks/useFetchApiData2";
import {CircularProgress} from "@material-ui/core";
import useForm from "../../../hooks/useForm";
import DatePicker from '../../../atoms/DatePicker/DatePicker';
import FormInputText from '../../../molecules/FormInputText/FormInputText';
import Button from '../../../atoms/Button/Button';
import Heading from '../../../atoms/Heading/Heading';
import FormSelectbox from '../../../molecules/FormSelectbox/FormSelectbox';
import Text from '../../../atoms/Text/Text';
import InputTextarea from '../../../atoms/InputTextarea/InputTextarea';
import Badge from '../../../atoms/Badge/Badge';
import styles from '../styles.module.css';
import LinkBtn from '../../../atoms/LinkButton/LinkBtn';
import { useRecoilValue } from 'recoil';
import { menuAdminState } from '../../../store/menuState';


function NotificationEdit(props) {
    // urlの設定
    const baseUrl = `/api/admin/notifications/${props.match.params.id}/edit`;
    // paramsの適用範囲を決めるscope名を定義
    const model = 'NOTIFICATION';
    // APIと接続して返り値を取得
    const {data, errorMessage, updateData} = useFetchApiData2(baseUrl, model);
    // フォーム項目の初期値をuseStateで管理
    const [formData, {setFormData, handleFormData, handleFormDate}] = useForm({
        'title': null,
        'body': null,
        'is_published': 0, // 0: 非公開 1: 公開中
        'expired_at': null
    });
    // リダイレクト用の関数呼び出し
    const history = useHistory();
    // API接続の返却値を変数に格納
    const notification = data.notification;
    // menuの状態管理
    const openAdminMenu = useRecoilValue(menuAdminState);

    useEffect(() => {
        // 非同期で通信されるので初回読み込み時にnotificationが入ってこない場合があるので条件分岐してあげる
        if(notification) {
            // フォームのデフォルト値を設定するためにsetFormDataで値をセット
            setFormData({...notification});
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
                        <Heading tag={'h1'} tag_style={'h1'} className={styles.mb_16}>お知らせ編集</Heading>
                        <div className={styles.form_area}>
                            <form onSubmit={ e => {
                                e.preventDefault();
                                updateData({
                                    form: formData, 
                                    url: `/api/admin/notifications/${props.match.params.id}`,
                                    callback: () => history.push('/admin/notifications') 
                                });
                            }}>
                                <div className={styles.mb_16}>
                                    <FormInputText
                                        name={'title'}
                                        onBlur={handleFormData}
                                        value={formData.title}
                                        label={'タイトル'}
                                        error={errorMessage}
                                        placeholder='タイトル名'
                                        required={true}
                                    />
                                </div>
                                <div className={styles.mb_16}>
                                    <div className={[styles.flex, styles.mb_8].join(' ')} >
                                        <Text className={styles.mr_4}>本文</Text>
                                        <Badge text='必須' />
                                    </div>
                                    {/* TODO: error時にフォームを赤くする */}
                                    <InputTextarea
                                        name={'body'} 
                                        value={formData.body}
                                        onBlur={handleFormData} 
                                        placeholder={'本文を入力'}
                                        style={{'minHeight' : '250px'}}
                                    />
                                    { errorMessage && <Text role='error' size='s' className={styles.mt_8}>{errorMessage.body}</Text> }
                                </div>
                                <div className={[styles.flex, styles.mb_40, styles.flex_sp].join(' ')}>
                                    <div className={[styles.flex_grow, styles.mr_24, styles.mb_16_sp].join(' ')}>
                                        <FormSelectbox
                                            name='is_published'
                                            value={formData.is_published}
                                            onChange={handleFormData}
                                            label={'公開設定'}
                                            error={errorMessage}
                                            required={true}
                                        >
                                            <option value={0}>非公開</option>
                                            <option value={1}>公開</option>
                                        </FormSelectbox>
                                    </div>
                                    <div>
                                        <div className={styles.mb_10}>
                                            <label htmlFor='expired_at'><Text>掲載終了日</Text></label>
                                        </div>
                                        <div>
                                            <DatePicker name={'expired_at'} value={formData.expired_at} onChange={handleFormDate} />
                                            { errorMessage && <Text role='error' size='s'>{errorMessage.expired_at}</Text> }
                                        </div>
                                    </div>
                                </div>
                                <div className={[styles.flex, styles.align_center, styles.justify_center].join(' ')}>
                                    <LinkBtn to={`/admin/notifications`} size='l' className={[styles.mr_12, styles.w_100].join(' ')} >一覧に戻る</LinkBtn>
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

export default NotificationEdit;

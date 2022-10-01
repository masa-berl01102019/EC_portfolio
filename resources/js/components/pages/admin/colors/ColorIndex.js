import React, {Suspense, useState} from 'react';
import {CircularProgress} from '@material-ui/core';
import useFetchApiData2 from "../../../hooks/useFetchApiData2";
import useForm from "../../../hooks/useForm";
import Heading from '../../../atoms/Heading/Heading';
import Button from '../../../atoms/Button/Button';
import InputText from '../../../atoms/InputText/InputText';
import Text from '../../../atoms/Text/Text';
import styles from '../styles.module.css';
import { useRecoilValue } from 'recoil';
import { menuAdminState } from '../../../store/menuState';

function ColorIndex() {
    // urlの設定
    const baseUrl = `/api/admin/colors`;
    // modelの設定
    const model = 'COLOR';
    // APIと接続して返り値を取得
    const {data, errorMessage, createData, deleteData, updateData} = useFetchApiData2(baseUrl, model);
    // APIから取得したデータを変数に格納
    const colors = data.colors? data.colors: null;
    // 新規登録用フォーム項目の初期値をuseStateで管理
    const [formData, {handleFormData}] = useForm({'color_name': ''});
    // 選択されたカラーのIDをuseStateで管理
    const [editableForm, setEeditableForm] = useState(null);
    // 編集用の入力値をuseStateで管理
    const [editColor, setEditColor] = useState(null);
    // menuの状態管理
    const openAdminMenu = useRecoilValue(menuAdminState);

    
    return (
        <main>
            <Suspense fallback={<CircularProgress disableShrink />}>
            {
                errorMessage && errorMessage.httpRequestError ? (
                    <Text role='error'>{errorMessage.httpRequestError}</Text>
                ) : (
                    <div className={ openAdminMenu ? [styles.container_open_menu, styles.max_content].join(' ') : [styles.container, styles.max_content].join(' ') }>
                        <Heading tag={'h1'} tag_style={'h1'} className={styles.mb_16}>カラーマスタ</Heading>
                        { errorMessage && <Text role='error' size='s'>{errorMessage.color_name}</Text> }
                        <div className={styles.form_area}>
                            <div>
                                <form onSubmit={ e => {
                                    e.preventDefault();
                                    createData({
                                        form: formData, 
                                        url:'/api/admin/colors'
                                    });
                                }}>
                                    <div className={styles.flex}>
                                        <InputText
                                            name={'color_name'}
                                            type={'text'}
                                            onBlur={handleFormData}
                                            value={formData.color_name}
                                            placeholder='カラー名'
                                            className={[styles.flex_1, styles.mr_4].join(' ')}
                                        />
                                        <Button size='s' color='primary' type="submit">カラー追加</Button>
                                    </div>
                                </form>
                            </div>
                            <br/>
                            <div className={styles.master_form_area}>
                                { colors &&
                                    colors.map((color) =>
                                        <div key={color.id} className={styles.master_text_area}>
                                            { color.id === editableForm ? (
                                                <div className={styles.flex}>
                                                    <InputText
                                                        name={'color_name'}
                                                        type={'text'}
                                                        onBlur={e => setEditColor(e.target.value)}
                                                        value={color.color_name}
                                                        placeholder='カラー名'
                                                        className={[styles.mr_4, styles.w_100].join(' ')}
                                                    />
                                                    <Button onClick={() => { 
                                                            updateData({
                                                                form: {color_name: `${editColor}`},
                                                                url:`/api/admin/colors/${color.id}`
                                                            })
                                                        }}
                                                        size='s' 
                                                        color='primary'
                                                        className={styles.mr_4}
                                                    >編集</Button>
                                                    <Button onClick={() => { 
                                                            let answer = confirm(`選択カラーを本当に削除しますか？`);
                                                            answer && deleteData({
                                                                url:`/api/admin/colors/${color.id}`
                                                            });
                                                        }}
                                                        size='s' 
                                                    >削除</Button>
                                                </div>
                                                ) : (
                                                <div className={styles.master_editable_text} onClick={() => {
                                                    setEditColor(color.color_name);
                                                    setEeditableForm(color.id);
                                                }}>{color.color_name}</div>
                                            )
                                            }
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                )
            }
            </Suspense>
        </main>
    );
}

export default ColorIndex;




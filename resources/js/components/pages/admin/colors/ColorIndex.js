import React, {Suspense, useState} from 'react';
import {CircularProgress} from '@material-ui/core';
import useFetchApiData2 from "../../../hooks/useFetchApiData2";
import useForm from "../../../hooks/useForm";
import Heading from '../../../atoms/Heading/Heading';
import Text from '../../../atoms/Text/Text';
import styles from '../styles.module.css';
import { useRecoilValue } from 'recoil';
import { menuAdminState } from '../../../store/menuState';
import FormWithBtn from '../../../molecules/Form/FormWithBtn';

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
                    <Text className={styles.http_error}>{errorMessage.httpRequestError}</Text>
                ) : (
                    <div className={ openAdminMenu ? [styles.container_open_menu, styles.max_content].join(' ') : [styles.container, styles.max_content].join(' ') }>
                        <Heading tag={'h1'} tag_style={'h1'} className={styles.mb_16}>カラーマスタ</Heading>
                        { errorMessage && <Text role='error' size='s'>{errorMessage.color_name}</Text> }
                        <div className={styles.form_area}>
                            <FormWithBtn
                                name='color_name'
                                value={formData.color_name}
                                onChange={handleFormData}
                                placeholder='カラー名'
                                createMethod={() => createData({ form: formData, url:'/api/admin/colors' }) }
                                className={styles.mb_24}
                            />
                            <div className={styles.master_form_area}>
                            {   colors && colors.map((color) =>
                                <div key={color.id} className={styles.master_text_area}>
                                    { color.id === editableForm ? (
                                        <FormWithBtn
                                            name='color_name'
                                            value={color.color_name}
                                            onChange={e => setEditColor(e.target.value)}
                                            placeholder='カラー名'
                                            updateMethod={() => 
                                                updateData({
                                                    form: {color_name: `${editColor}`},
                                                    url:`/api/admin/colors/${color.id}`
                                                })
                                            }
                                            deleteMethod={() => { 
                                                let answer = confirm(`選択カラーを本当に削除しますか？`);
                                                answer && deleteData({
                                                    url:`/api/admin/colors/${color.id}`
                                                });
                                            }}
                                        />
                                    ) : (
                                        <div className={styles.master_editable_text} onClick={() => {
                                            setEditColor(color.color_name);
                                            setEeditableForm(color.id);
                                        }}>{color.color_name}</div>
                                    )}
                                </div>
                            )}
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




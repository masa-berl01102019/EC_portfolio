import React, {Suspense, useState} from 'react';
import {CircularProgress} from '@material-ui/core';
import useFetchApiData from "../../../hooks/useFetchApiData";
import Heading from '../../../atoms/Heading/Heading';
import Text from '../../../atoms/Text/Text';
import styles from '../styles.module.css';
import { useRecoilValue } from 'recoil';
import { menuAdminState } from '../../../store/menuState';
import FormWithBtn from '../../../molecules/Form/FormWithBtn';
import useNotify from '../../../context/NotifyContext';

function ColorIndex() {
    // urlの設定
    const baseUrl = `/api/admin/colors`;
    // modelの設定
    const model = 'COLOR';
    // APIと接続して返り値を取得
    const {data, errorMessage, createData, deleteData, updateData} = useFetchApiData(baseUrl, model);
    // APIから取得したデータを変数に格納
    const colors = data.colors? data.colors: null;
    // 選択されたカラーのIDをuseStateで管理
    const [editableForm, setEeditableForm] = useState(null);
    // menuの状態管理
    const openAdminMenu = useRecoilValue(menuAdminState);
    // notifyContextの呼び出し
    const confirm = useNotify();

    const handleConfirmDelete = async () => {
        const result = await confirm({
            body : `選択カラーを本当に削除しますか？`,
            confirmBtnLabel : '削除'
        });
        result && deleteData({ url:`/api/admin/colors/${editableForm}` });
    }
    
    return (
        <main>
            <Suspense fallback={<CircularProgress disableShrink />}>
                <div className={ openAdminMenu ? [styles.container_open_menu, styles.max_content].join(' ') : [styles.container, styles.max_content].join(' ') }>
                    <Heading tag={'h1'} tag_style={'h1'} className={styles.mb_16}>カラーマスタ</Heading>
                    { errorMessage && <Text role='error' size='s'>{errorMessage.color_name}</Text> }
                    <div className={styles.form_area}>
                        <FormWithBtn
                            name='color_name'
                            placeholder='カラー名'
                            formInitialValue={{'color_name': ''}}
                            validateScope={'admin'}
                            validateConfigKey={'color_request'}
                            requestUrl={'/api/admin/colors'}
                            createMethod={createData}
                            className={styles.mb_24}
                        />
                        <div className={styles.master_form_area}>
                        {   colors && colors.map((color) =>
                            <div key={color.id} className={styles.master_text_area}>
                                { color.id === editableForm ? (
                                    <FormWithBtn
                                        name='color_name'
                                        placeholder='カラー名'
                                        formInitialValue={{'color_name': color.color_name}}
                                        validateScope={'admin'}
                                        validateConfigKey={'color_request'}
                                        requestUrl={`/api/admin/colors/${editableForm}`}
                                        updateMethod={updateData}
                                        deleteMethod={handleConfirmDelete}
                                    />
                                ) : (
                                    <div className={styles.master_editable_text} onClick={() => setEeditableForm(color.id)}>{color.color_name}</div>
                                )}
                            </div>
                        )}
                        </div>
                    </div>
                </div>
            </Suspense>
        </main>
    );
}

export default ColorIndex;




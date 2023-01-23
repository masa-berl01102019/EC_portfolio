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

function SizeIndex() {
    // urlの設定
    const baseUrl = `/api/admin/sizes`;
    // modelの設定
    const model = 'SIZE';
    // APIと接続して返り値を取得
    const {data, errorMessage, createData, deleteData, updateData} = useFetchApiData(baseUrl, model);
    // APIから取得したデータを変数に格納
    const sizes = data.sizes? data.sizes: null;
    // 選択されたサイズのIDをuseStateで管理
    const [editableForm, setEeditableForm] = useState(null);
    // menuの状態管理
    const openAdminMenu = useRecoilValue(menuAdminState);
    // notifyContextの呼び出し
    const confirm = useNotify();

    const handleConfirmDelete = async () => {
        const result = await confirm({
            body : `選択サイズを本当に削除しますか？`,
            confirmBtnLabel : '削除'
        });
        result && deleteData({ url:`/api/admin/sizes/${editableForm}` });
    }
    
    return (
        <main>
            <Suspense fallback={<CircularProgress disableShrink />}>
                <div className={ openAdminMenu ? [styles.container_open_menu, styles.max_content].join(' ') : [styles.container, styles.max_content].join(' ') }>
                    <Heading tag={'h1'} tag_style={'h1'} className={styles.mb_16}>サイズマスタ</Heading>
                    { errorMessage && <Text role='error' size='s'>{errorMessage.size_name}</Text> }
                    <div className={styles.form_area}>
                        <FormWithBtn
                            name='size_name'
                            placeholder='サイズ名'
                            formInitialValue={{'size_name': ''}}
                            validateScope={'admin'}
                            validateConfigKey={'size_request'}
                            requestUrl={'/api/admin/sizes'}
                            createMethod={createData}
                            className={styles.mb_24}
                        />
                        <div className={styles.master_form_area}>
                        {   sizes &&
                            sizes.map((size) =>
                                <div key={size.id} className={styles.master_text_area}>
                                    { size.id === editableForm ? (
                                        <FormWithBtn
                                            name='size_name'
                                            placeholder='サイズ名'
                                            formInitialValue={{'size_name': size.size_name}}
                                            validateScope={'admin'}
                                            validateConfigKey={'size_request'}
                                            requestUrl={`/api/admin/sizes/${editableForm}`}
                                            updateMethod={updateData}
                                            deleteMethod={handleConfirmDelete}
                                        />
                                    ) : (
                                        <div className={styles.master_editable_text} onClick={() => setEeditableForm(size.id)}>{size.size_name}</div>
                                    )}
                                </div>
                            )
                        }
                        </div>
                    </div>
                </div>
            </Suspense>
        </main>
    );
}

export default SizeIndex;




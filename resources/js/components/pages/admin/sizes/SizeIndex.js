import React, {Suspense, useState} from 'react';
import {CircularProgress} from '@material-ui/core';
import useFetchApiData from "../../../hooks/useFetchApiData";
import useForm from "../../../hooks/useForm";
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
    // 新規登録用フォーム項目の初期値をuseStateで管理
    const [formData, {handleFormData}] = useForm({'size_name': ''});
    // 選択されたサイズのIDをuseStateで管理
    const [editableForm, setEeditableForm] = useState(null);
    // 編集用の入力値をuseStateで管理
    const [editSize, setEditSize] = useState(null);
    // menuの状態管理
    const openAdminMenu = useRecoilValue(menuAdminState);

    // notifyContextの呼び出し
    const confirm = useNotify();

    const handleConfirmDelete = async (id) => {
        const result = await confirm({
            body : `選択サイズを本当に削除しますか？`,
            confirmBtnLabel : '削除'
        });
        result && deleteData({ url:`/api/admin/sizes/${id}` });
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
                            value={formData.size_name}
                            onChange={handleFormData}
                            placeholder='サイズ名'
                            createMethod={() => createData({ form: formData,  url:'/api/admin/sizes'}) }
                            className={styles.mb_24}
                        />
                        <div className={styles.master_form_area}>
                        {   sizes &&
                            sizes.map((size) =>
                                <div key={size.id} className={styles.master_text_area}>
                                    { size.id === editableForm ? (
                                        <FormWithBtn
                                            name='size_name'
                                            value={size.size_name}
                                            onChange={e => setEditSize(e.target.value)}
                                            placeholder='サイズ名'
                                            updateMethod={() => 
                                                updateData({form: {size_name: `${editSize}`}, url:`/api/admin/sizes/${size.id}`}) 
                                            }
                                            deleteMethod={() => handleConfirmDelete(size.id)}
                                        />
                                    ) : (
                                        <div className={styles.master_editable_text} onClick={() => {
                                            setEditSize(size.size_name);
                                            setEeditableForm(size.id);
                                        }}>{size.size_name}</div>
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




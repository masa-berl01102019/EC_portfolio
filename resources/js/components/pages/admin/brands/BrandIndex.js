import React, {Suspense, useState} from 'react';
import {CircularProgress} from '@material-ui/core';
import useFetchApiData from "../../../hooks/useFetchApiData";
import useForm from "../../../hooks/useForm";
import Heading from '../../../atoms/Heading/Heading';
import styles from '../styles.module.css';
import { useRecoilValue } from 'recoil';
import { menuAdminState } from '../../../store/menuState';
import FormWithBtn from '../../../molecules/Form/FormWithBtn';
import useNotify from '../../../context/NotifyContext';

function BrandIndex() {
    // urlの設定
    const baseUrl = `/api/admin/brands`;
    // modelの設定
    const model = 'BRAND';
    // APIと接続して返り値を取得
    const {data, errorMessage, createData, deleteData, updateData} = useFetchApiData(baseUrl, model);
    // APIから取得したデータを変数に格納
    const brands = data.brands? data.brands: null;
    // 新規登録用フォーム項目の初期値をuseStateで管理
    const [formData, {handleFormData}] = useForm({'brand_name': ''});
    // 選択されたブランドのIDをuseStateで管理
    const [editableForm, setEeditableForm] = useState(null);
    // 編集用の入力値をuseStateで管理
    const [editBrand, setEditBrand] = useState(null);
    // menuの状態管理
    const openAdminMenu = useRecoilValue(menuAdminState);

    // notifyContextの呼び出し
    const confirm = useNotify();

    const handleConfirmDelete = async (id) => {
        const result = await confirm({
            body : `選択ブランドを本当に削除しますか？`,
            confirmBtnLabel : '削除'
        });
        result && deleteData({ url:`/api/admin/brands/${id}` });
    }

    return (
        <main>
            <Suspense fallback={<CircularProgress disableShrink />}>
            {
                errorMessage && errorMessage.httpRequestError ? (
                    <Text className={styles.http_error}>{errorMessage.httpRequestError}</Text>
                ) : (
                    <div className={ openAdminMenu ? [styles.container_open_menu, styles.max_content].join(' ') : [styles.container, styles.max_content].join(' ') }>
                        <Heading tag={'h1'} tag_style={'h1'} className={styles.mb_16}>ブランドマスタ</Heading>
                        { errorMessage && <Text role='error' size='s'>{errorMessage.brand_name}</Text> }
                        <div className={styles.form_area}>
                            <FormWithBtn
                                name='brand_name'
                                value={formData.brand_name}
                                onChange={handleFormData}
                                placeholder='ブランド名'
                                createMethod={() => createData({ form: formData, url:'/api/admin/brands' }) }
                                className={styles.mb_24}
                            />
                            <div className={styles.master_form_area}>
                            { brands && brands.map((brand) =>
                                <div key={brand.id} className={styles.master_text_area}>
                                    { brand.id === editableForm ? (
                                        <FormWithBtn
                                            name='brand_name'
                                            value={brand.brand_name}
                                            onChange={e => setEditBrand(e.target.value)}
                                            placeholder='ブランド名'
                                            updateMethod={() => 
                                                updateData({
                                                    form: {brand_name: `${editBrand}`},
                                                    url:`/api/admin/brands/${brand.id}`
                                                })
                                            }
                                            deleteMethod={() => handleConfirmDelete(brand.id)}
                                        />
                                    ) : (
                                        <div className={styles.master_editable_text} onClick={() => {
                                            setEditBrand(brand.brand_name);
                                            setEeditableForm(brand.id);
                                        }}>{brand.brand_name}</div>
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

export default BrandIndex;




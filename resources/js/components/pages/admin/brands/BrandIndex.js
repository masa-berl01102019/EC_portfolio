import React, {Suspense, useState} from 'react';
import {CircularProgress} from '@material-ui/core';
import useFetchApiData from "../../../hooks/useFetchApiData";
import Heading from '../../../atoms/Heading/Heading';
import styles from '../styles.module.css';
import { useRecoilValue } from 'recoil';
import { menuAdminState } from '../../../store/menuState';
import FormWithBtn from '../../../molecules/Form/FormWithBtn';
import useNotify from '../../../context/NotifyContext';
import Text from '../../../atoms/Text/Text';

function BrandIndex() {
    // urlの設定
    const baseUrl = `/api/admin/brands`;
    // modelの設定
    const model = 'BRAND';
    // APIと接続して返り値を取得
    const {data, errorMessage, createData, deleteData, updateData} = useFetchApiData(baseUrl, model);
    // APIから取得したデータを変数に格納
    const brands = data.brands? data.brands: null;
    // 選択されたブランドのIDをuseStateで管理
    const [editableForm, setEeditableForm] = useState(null);
    // menuの状態管理
    const openAdminMenu = useRecoilValue(menuAdminState);
    // notifyContextの呼び出し
    const confirm = useNotify();

    const handleConfirmDelete = async () => {
        const result = await confirm({
            body : `選択ブランドを本当に削除しますか？`,
            confirmBtnLabel : '削除'
        });
        result && deleteData({ url:`/api/admin/brands/${editableForm}` });
    }

    return (
        <main>
            <Suspense fallback={<CircularProgress disableShrink />}>
                <div className={ openAdminMenu ? [styles.container_open_menu, styles.max_content].join(' ') : [styles.container, styles.max_content].join(' ') }>
                    <Heading tag={'h1'} tag_style={'h1'} className={styles.mb_16}>ブランドマスタ</Heading>
                    { errorMessage && <Text role='error' size='s'>{errorMessage.brand_name}</Text> }
                    <div className={styles.form_area}>
                        <FormWithBtn
                            name='brand_name'
                            placeholder='ブランド名'
                            formInitialValue={{'brand_name': ''}}
                            validateScope={'admin'}
                            validateConfigKey={'brand_request'}
                            requestUrl={'/api/admin/brands'}
                            createMethod={createData}
                            className={styles.mb_24}
                        />
                        <div className={styles.master_form_area}>
                        { brands && brands.map((brand) =>
                            <div key={brand.id} className={styles.master_text_area}>
                                { brand.id === editableForm ? (
                                    <FormWithBtn
                                        name='brand_name'
                                        placeholder='ブランド名'
                                        formInitialValue={{'brand_name': brand.brand_name}}
                                        validateScope={'admin'}
                                        validateConfigKey={'brand_request'}
                                        requestUrl={`/api/admin/brands/${editableForm}`}
                                        updateMethod={updateData}
                                        deleteMethod={handleConfirmDelete}
                                    />
                                ) : (
                                    <div className={styles.master_editable_text} onClick={() => setEeditableForm(brand.id)}>{brand.brand_name}</div>
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

export default BrandIndex;




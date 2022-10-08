import React, {Suspense, useEffect, useState} from 'react';
import {CircularProgress} from '@material-ui/core';
import useFetchApiData from "../../../hooks/useFetchApiData";
import {useCreateUrl} from "../../../hooks/useCreateUrl";
import Pagination from '../../../molecules/Pagination/Pagination';
import { useRecoilState, useRecoilValue } from 'recoil';
import { paramState } from '../../../store/paramState';
import Heading from '../../../atoms/Heading/Heading';
import FilterSortBtn from '../../../molecules/IconBtn/FilterSortBtn';
import ContactTable from '../../../organisms/admin/Table/ContactTable';
import Text from '../../../atoms/Text/Text';
import ContactSidebar from '../../../organisms/admin/SideBar/ContactSidebar';
import styles from '../styles.module.css';
import { menuAdminState } from '../../../store/menuState';

function ContactIndex() {
    // urlの設定
    const baseUrl = `/api/admin/contacts`;
    // paramsの適用範囲を決めるscope名を定義
    const model = 'CONTACT';
    // グローバルステート呼び出し
    const [params, setParams] = useRecoilState(paramState(model));
    // APIと接続して返り値を取得
    const {data, errorMessage, deleteData, getCSVData} = useFetchApiData(useCreateUrl(baseUrl, params), model);
    // APIから取得したデータを変数に格納
    const contacts = data.data? data.data: null;
    // 検索タブのステータス
    const [open, setOpen] = useState(false);
    // menuの状態管理
    const openAdminMenu = useRecoilValue(menuAdminState);

    useEffect(() => {
        // paramsのデフォルト値と適用範囲を設定
        if(params.scope === null) {
            console.log('CONTACTにてparamsの初期値をセット');
            setParams({
                paginate: {},
                sort: { 'last_name_kana' : '', 'created_at' : '', 'updated_at' : '' },
                filter: { 'search' : '', 'response_status' : [], 'target_span' : '', 'from' : null, 'to' : null },
                scope: model
            });
        }
    },[]);

    
    return (
        <main>
            <Suspense fallback={<CircularProgress disableShrink />}>
            {
                errorMessage && errorMessage.httpRequestError ? (
                    <Text className={styles.http_error}>{errorMessage.httpRequestError}</Text>
                ) : (
                    <div className={ openAdminMenu ? [styles.container_open_menu, styles.flex].join(' ') : [styles.container, styles.flex].join(' ') }>
                        {   open && <ContactSidebar model={model} onClick={() => setOpen(false)} /> }
                        <div className={open ? [styles.open_sidebar, styles.flex_1].join(' ') : styles.flex_1}>

                            <div className={styles.index_title}>
                                <Heading tag={'h1'} tag_style={'h1'} className={styles.mr_auto}>
                                    お問い合わせ一覧 { data.meta && ` ( ${data.meta.total} 件 )`}
                                </Heading>
                                <FilterSortBtn onClick={() => setOpen(!open)}>詳細検索</FilterSortBtn>
                            </div>

                            <ContactTable contacts={contacts} deleteMethod={deleteData} csvOutputMethod={getCSVData} className={[styles.mb_16, styles.table_scroll_area].join(' ')} />
                            
                            <Pagination meta={data.meta} model={model} />
                        </div>
                    </div>
                )
            }
            </Suspense>
        </main>
    );
}

export default ContactIndex;




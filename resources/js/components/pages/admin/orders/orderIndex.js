import React, {useEffect, useState, Suspense} from 'react';
import {CircularProgress} from '@material-ui/core';
import useFetchApiData2 from "../../../hooks/useFetchApiData2";
import {useCreateUrl} from "../../../hooks/useCreateUrl";
import Pagination from '../../../molecules/Pagination/Pagination';
import Heading from '../../../atoms/Heading/Heading';
import OrderTable from '../../../organisms/admin/Table/OrderTable';
import FilterSortBtn from '../../../molecules/IconBtn/FilterSortBtn';
import { useRecoilState, useRecoilValue } from 'recoil';
import { paramState } from '../../../store/paramState';
import Text from '../../../atoms/Text/Text';
import OrderSidebar from '../../../organisms/admin/SideBar/OrderSidebar';
import styles from '../styles.module.css';
import { menuAdminState } from '../../../store/menuState';

const OrderIndex = () => {
    // urlの設定
    const baseUrl = `/api/admin/orders`;
    // paramsの適用範囲を決めるscope名を定義
    const model = 'ORDER';
    // グローバルステート呼び出し
    const [params, setParams] = useRecoilState(paramState(model));
    // APIと接続して返り値を取得
    const {data, errorMessage, deleteData, getCSVData} = useFetchApiData2(useCreateUrl(baseUrl, params), model);
    // APIから取得したデータを変数に格納
    const orders = data.data? data.data: null;
    // 検索タブのステータス
    const [open, setOpen] = useState(false);
    // menuの状態管理
    const openAdminMenu = useRecoilValue(menuAdminState);

    useEffect(() => {
        // paramsのデフォルト値と適用範囲を設定
        if(params.scope === null) {
            console.log('SALESにてparamsの初期値をセット');
            setParams({
                paginate: {},
                sort: { 'total_amount' : '', 'created_at' : '', 'delivery_date' : '', 'updated_at' : ''},
                filter: { 'payment_method' : '', 'is_paid' : '', 'is_shipped' : '', 'target_span' : '', 'from' : null, 'to' : null},
                scope: model
            });
        }
    },[]);
    
    
    return (
        <main>
            <Suspense fallback={<CircularProgress disableShrink />}>
            {
                errorMessage && errorMessage.httpRequestError ? (
                    <Text role='error'>{errorMessage.httpRequestError}</Text>
                ) : (
                    <div className={ openAdminMenu ? [styles.container_open_menu, styles.flex].join(' ') : [styles.container, styles.flex].join(' ') }>
                        { open && <OrderSidebar model={model} onClick={() => setOpen(false)} /> }
                        <div className={open ? [styles.open_sidebar, styles.flex_1].join(' ') : styles.flex_1}>

                            <div className={styles.index_title}>
                                <Heading tag={'h1'} tag_style={'h1'} className={styles.mr_auto}>
                                    受注一覧 { data.meta && ` ( ${data.meta.total} 件 )`}
                                </Heading>
                                <FilterSortBtn onClick={() => setOpen(!open)} className={styles.mr_16}>詳細検索</FilterSortBtn>
                            </div>

                            <OrderTable orders={orders} deleteMethod={deleteData} csvOutputMethod={getCSVData} className={[styles.mb_16, styles.table_scroll_area].join(' ')} />

                            <Pagination meta={data.meta} model={model} />
                        </div>
                    </div>
                )
            }
            </Suspense>
        </main>
    );
}

export default OrderIndex;




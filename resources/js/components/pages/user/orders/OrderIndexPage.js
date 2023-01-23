import React, {Suspense, useEffect} from 'react';
import {CircularProgress} from '@material-ui/core';
import useFetchApiData from "../../../hooks/useFetchApiData";
import useCreateParams from "../../../hooks/useCreateParams";
import {useCreateUrl} from "../../../hooks/useCreateUrl";
import { useRecoilState } from 'recoil';
import { paramState } from '../../../store/paramState';
import Heading from '../../../atoms/Heading/Heading';
import OrderedItemCard from '../../../molecules/Card/OrderedItemCard';
import styles from '../styles.module.css';
import PaginationList from '../../../atoms/PaginationList/PaginationList';

function OrderIndexPage() {
    // urlの設定
    const baseUrl = `/api/user/orders`;
    // paramsの適用範囲を決めるscope名を定義
    const model = 'ORDER';
    // URLパラメータ変更のフックの呼び出し
    const {handleCurrentPage} = useCreateParams(model);
    // グローバルステート呼び出し
    const [params, setParams] = useRecoilState(paramState(model));
    // APIと接続して返り値を取得
    const {data, errorMessage, createData} = useFetchApiData(useCreateUrl(baseUrl, params), model);
    // APIから取得したデータを変数に格納
    const orders = data.data? data.data: null;

    useEffect(() => {
        // paramsのデフォルト値と適用範囲を設定
        if(params.scope === null) {
            console.log('ORDERにてparamsの初期値をセット');
            setParams({
                paginate: {},
                scope: model
            });
        }
    },[]);

    return (
        <main className={styles.mt_40}>
            <Suspense fallback={<CircularProgress disableShrink />}>
                <Heading tag={'h1'} tag_style={'h1'} className={styles.section_title}>購入履歴</Heading>
                <div className={styles.main_contents_area}>
                {   orders &&
                    <div className={[styles.flex, styles.flex_wrap, styles.mb_24].join(' ')}> 
                        {                        
                            orders.map((order) =>
                                <OrderedItemCard
                                    key={order.id}
                                    src={order.top_image}
                                    to={`/items/${order.item_id}`}
                                    brand_name={order.brand_name}
                                    item_name={order.item_name}
                                    price={order.order_price_text}
                                    color_name={order.order_color}
                                    size_name={order.order_size}
                                    created_at={order.created_at}
                                    stock_status={order.stock_status}
                                    cart_status={order.cart_status}
                                    is_published={order.is_published}
                                    delete_status={order.delete_status}
                                    create_method={() => createData({ form: {sku_id: `${order.sku_id}`}, url:`/api/user/carts` })}
                                />
                            )
                        }
                    </div>
                }
                    <PaginationList meta={data.meta} onChange={handleCurrentPage} />
                </div>
            </Suspense>
        </main>
    );
}

export default OrderIndexPage;




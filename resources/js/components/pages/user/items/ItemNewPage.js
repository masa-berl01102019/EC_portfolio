import React, {Suspense, useEffect} from 'react';
import {CircularProgress} from '@material-ui/core';
import useFetchApiData from "../../../hooks/useFetchApiData";
import useCreateParams from "../../../hooks/useCreateParams";
import { useRecoilState } from 'recoil';
import { paramState } from '../../../store/paramState';
import {useCreateUrl} from "../../../hooks/useCreateUrl";
import TopItemCard from '../../../molecules/Card/TopItemCard';
import PaginationList from '../../../atoms/PaginationList/PaginationList';
import Heading from '../../../atoms/Heading/Heading';
import Text from '../../../atoms/Text/Text';
import styles from '../styles.module.css';

function ItemNewPage() {
    // urlの設定
    const baseUrl = `/api/user/items/new`;
    // paramsの適用範囲を決めるscope名を定義
    const model = 'NEW';
    // URLパラメータ変更のフックの呼び出し
    const {handleCurrentPage} = useCreateParams(model);
    // グローバルステート呼び出し
    const [params, setParams] = useRecoilState(paramState(model));
    // APIと接続して返り値を取得
    const {data, errorMessage} = useFetchApiData(useCreateUrl(baseUrl, params), model);
    // APIから取得したデータを変数に格納
    const items = data.data? data.data: null;


    useEffect(() => {
        // paramsのデフォルト値と適用範囲を設定
        if(params.scope === null) {
            console.log('RECOMMENDにてparamsの初期値をセット');
            setParams({
                paginate: {},
                sort: { 'price' : '', 'posted_at' : '' },
                filter: { 'search' : '',  'tag' : [], 'color' : [], 'size' : [], 'brand' : [], 'gender_category' : '', 'main_category' : '', 'sub_category' : '' },
                scope: model
            });
        }
    },[]);

    
    return (
        <main className={styles.mt_40}>
            <Suspense fallback={<CircularProgress disableShrink />}>
            {
                errorMessage && errorMessage.httpRequestError ? (
                    <Text className={styles.http_error}>{errorMessage.httpRequestError}</Text>
                ) : (
                    <>
                        <Heading tag={'h1'} tag_style={'h1'} className={styles.section_title}>新着一覧</Heading>
                        <div className={styles.main_contents_area}>
                            {   items &&
                                <div className={[styles.search_item_area, styles.mb_24].join(' ')}>
                                    {                        
                                        items.map((item) =>
                                            <TopItemCard 
                                                key={item.id}
                                                src={item.top_image}
                                                to={`/items/${item.id}`}
                                                brand_name={item.brand_name}
                                                item_name={item.item_name}
                                                price={item.included_tax_price_text}
                                                className={styles.item_card}
                                            />
                                        )
                                    }
                                </div>
                            }
                            <PaginationList meta={data.meta} onChange={handleCurrentPage} />
                        </div>
                    </>
                )
            }
            </Suspense>
        </main>
    );
}

export default ItemNewPage;
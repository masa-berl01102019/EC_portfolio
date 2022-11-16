import React, {Suspense, useEffect, useState} from 'react';
import {CircularProgress} from '@material-ui/core';
import useFetchApiData from "../../../hooks/useFetchApiData";
import useCreateParams from "../../../hooks/useCreateParams";
import { useRecoilState } from 'recoil';
import { paramState } from '../../../store/paramState';
import {useCreateUrl} from "../../../hooks/useCreateUrl";
import TopItemCard from '../../../molecules/Card/TopItemCard';
import PaginationList from '../../../atoms/PaginationList/PaginationList';
import Heading from '../../../atoms/Heading/Heading';
import ItemFilterModal from '../../../organisms/user/modal/ItemFilterModal';
import ItemSortModal from '../../../organisms/user/modal/ItemSortModal';
import FilterBtn from '../../../molecules/IconBtn/FilterBtn';
import SortBtn from '../../../molecules/IconBtn/SortBtn';
import styles from '../styles.module.css';

function ItemIndexPage() {
    // urlの設定
    const baseUrl = `/api/user/items`;
    // paramsの適用範囲を決めるscope名を定義
    const model = 'ITEM';
    // URLパラメータ変更のフックの呼び出し
    const {handleCurrentPage} = useCreateParams(model);
    // グローバルステート呼び出し
    const [params, setParams] = useRecoilState(paramState(model));
    // APIと接続して返り値を取得
    const {data, errorMessage} = useFetchApiData(useCreateUrl(baseUrl, params), model);
    // APIから取得したデータを変数に格納
    const items = data.data? data.data: null;
    const brands = data.brands? data.brands: null;
    const gender_categories = data.gender_categories? data.gender_categories: null;
    const main_categories = data.main_categories? data.main_categories: null;
    const sub_categories = data.sub_categories? data.sub_categories: null;
    const sizes = data.sizes? data.sizes: null;
    const colors = data.colors? data.colors: null;
    const tags = data.tags? data.tags: null;

    const [popup, setPopup] = useState('');

    useEffect(() => {
        // paramsのデフォルト値と適用範囲を設定
        if(params.scope === null) {
            console.log('ITEMにてparamsの初期値をセット');
            setParams({
                paginate: {},
                sort: { 'price' : '', 'posted_at' : '' },
                filter: { 'search' : '',  'tag' : [], 'color' : [], 'size' : [], 'brand' : [], 'gender_category' : '', 'main_category' : '', 'sub_category' : '', 'price_from' : '', 'price_to' : '', 'stock_status': '' },
                scope: model
            });
        } 
    },[]);

    
    return (
        <main className={styles.mt_40}>
            <Suspense fallback={<CircularProgress disableShrink />}>
                <div>
                    {   popup == '1' && 
                        <ItemFilterModal
                            brands={brands}
                            gender_categories={gender_categories}
                            main_categories={main_categories}
                            sub_categories={sub_categories}
                            sizes={sizes}
                            colors={colors}
                            tags={tags}
                            onClick={() => setPopup('')}
                            model={model}
                        />
                    }
                    {   popup == '2' && 
                        <ItemSortModal
                            onClick={() => setPopup('')}
                            model={model}
                        />
                    }
                    <Heading tag={'h1'} tag_style={'h1'} className={styles.section_title}>商品一覧</Heading>

                    <div className={styles.main_contents_area}>
                        <div className={[styles.flex, styles.justify_between, styles.mb_16].join(' ')}>
                            <FilterBtn onClick={() => setPopup('1')} className={styles.filter_sort_btn}>絞り込み</FilterBtn>
                            <SortBtn onClick={() => setPopup('2')} className={styles.filter_sort_btn}>並び替え</SortBtn>
                        </div>
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
                </div>
            </Suspense>
        </main>
    );
}

export default ItemIndexPage;




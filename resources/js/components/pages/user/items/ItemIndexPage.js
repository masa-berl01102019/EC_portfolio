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
import { useTranslation } from 'react-i18next';

function ItemIndexPage() {

    const baseUrl = `/api/user/items`;
    const model = 'ITEM';
    const {handleCurrentPage} = useCreateParams(model);
    const [params, setParams] = useRecoilState(paramState(model));
    const {data, errorMessage} = useFetchApiData(useCreateUrl(baseUrl, params), model);
    const {data:items, brands, gender_categories, main_categories, sub_categories, sizes, colors, tags} = data;
    const [popup, setPopup] = useState('');
    const { t } = useTranslation();

    useEffect(() => {
        if(params.scope === null) {
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
                    <Heading tag={'h1'} tag_style={'h1'} className={styles.section_title}>{t('user.item.index-title')}</Heading>

                    <div className={styles.main_contents_area}>
                        <div className={[styles.flex, styles.justify_between, styles.mb_16].join(' ')}>
                            <FilterBtn onClick={() => setPopup('1')} className={styles.filter_sort_btn}>{t('user.filter')}</FilterBtn>
                            <SortBtn onClick={() => setPopup('2')} className={styles.filter_sort_btn}>{t('user.sort')}</SortBtn>
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




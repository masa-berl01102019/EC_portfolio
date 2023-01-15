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
import styles from '../styles.module.css';
import { useTranslation } from 'react-i18next';

function ItemNewPage() {

    const baseUrl = `/api/user/items/new`;
    const model = 'NEW';
    const {handleCurrentPage} = useCreateParams(model);
    const [params, setParams] = useRecoilState(paramState(model));
    const {data, errorMessage} = useFetchApiData(useCreateUrl(baseUrl, params), model);
    const items = data.data? data.data: null;
    const { t } = useTranslation();

    useEffect(() => {
        if(params.scope === null) {
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
                <Heading tag={'h1'} tag_style={'h1'} className={styles.section_title}>{t('user.item.new-title')}</Heading>
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
            </Suspense>
        </main>
    );
}

export default ItemNewPage;
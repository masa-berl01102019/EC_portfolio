import React, {Suspense, useEffect, useState} from 'react';
import {CircularProgress} from '@material-ui/core';
import useFetchApiData from "../../../hooks/useFetchApiData";
import useCreateParams from "../../../hooks/useCreateParams";
import {useCreateUrl} from "../../../hooks/useCreateUrl";
import { useRecoilState } from 'recoil';
import { paramState } from '../../../store/paramState';
import Heading from '../../../atoms/Heading/Heading';
import PaginationList from '../../../atoms/PaginationList/PaginationList';
import BookmarkCard from '../../../molecules/Card/BookmarkCard';
import BookmarkFilterModal from '../../../organisms/user/modal/BookmarkFilterModal';
import BookmarkSortModal from '../../../organisms/user/modal/BookmarkSortModal';
import FilterBtn from '../../../molecules/IconBtn/FilterBtn';
import SortBtn from '../../../molecules/IconBtn/SortBtn';
import styles from '../styles.module.css';
import useI18next from '../../../context/I18nextContext';

function BookmarkIndexPage() {

    const baseUrl = `/api/user/bookmarks`;
    const model = 'BOOKMARK';
    const {handleCurrentPage} = useCreateParams(model);
    const [params, setParams] = useRecoilState(paramState(model));
    const {data, errorMessage, createData, deleteData} = useFetchApiData(useCreateUrl(baseUrl, params), model);
    const {data:bookmarks, sizes, colors, brands} = data;
    const [popup, setPopup] = useState('');
    const i18next = useI18next();

    useEffect(() => {
        if(params.scope === null) {
            setParams({
                paginate: {},
                sort: { 'price' : '', 'item_name' : '', 'updated_at' : '' },
                filter: { 'search' : '', 'brand' : [], 'size' : [], 'color' : [] },
                scope: model
            });
        }
    },[]);

    
    return (
        <main className={styles.mt_40}>
            <Suspense fallback={<CircularProgress disableShrink />}>
                <div>
                    {   popup == '1' && 
                        <BookmarkFilterModal
                            brands={brands}
                            sizes={sizes}
                            colors={colors}
                            onClick={() => setPopup('')}
                            model={model}
                        />
                    }
                    {   popup == '2' && 
                        <BookmarkSortModal
                            onClick={() => setPopup('')}
                            model={model}
                        />
                    }
                    <div className={styles.main_contents_area}>

                        <Heading tag={'h1'} tag_style={'h1'} className={styles.section_title}>{i18next.t('user.bookmark.index-title')}</Heading>

                        <div className={[styles.flex, styles.justify_between, styles.mb_16].join(' ')}>
                            <FilterBtn onClick={() => setPopup('1')} className={styles.filter_sort_btn}>{i18next.t('user.filter')}</FilterBtn>
                            <SortBtn onClick={() => setPopup('2')} className={styles.filter_sort_btn}>{i18next.t('user.sort')}</SortBtn>
                        </div>

                        {   bookmarks &&
                            <div className={[styles.mb_24 , styles.flex , styles.flex_wrap].join(' ')}> 
                                {                        
                                    bookmarks.map((bookmark) =>
                                        <BookmarkCard
                                            key={bookmark.id}
                                            src={bookmark.top_image}
                                            to={`/items/${bookmark.item_id}`}
                                            brand_name={bookmark.brand_name}
                                            item_name={bookmark.item_name}
                                            price={bookmark.included_tax_price_text}
                                            color_name={bookmark.color_name}
                                            size_name={bookmark.size_name}
                                            stock_status={bookmark.stock_status}
                                            cart_status={bookmark.cart_status}
                                            create_method={() => createData({ form: {sku_id: `${bookmark.sku_id}`}, url:`/api/user/carts` })}
                                            delete_method={() => deleteData({ url:`/api/user/bookmarks/${bookmark.id}` })}
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

export default BookmarkIndexPage;




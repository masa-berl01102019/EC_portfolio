import React, {Suspense, useEffect, useState} from 'react';
import {CircularProgress} from '@material-ui/core';
import useCreateParams from "../../../hooks/useCreateParams";
import { useRecoilState } from 'recoil';
import { paramState } from '../../../store/paramState';
import useFetchApiData2 from '../../../hooks/useFetchApiData2';
import {useCreateUrl} from "../../../hooks/useCreateUrl";
import Text from '../../../atoms/Text/Text';
import InfoCard from '../../../molecules/Card/InfoCard';
import PaginationList from '../../../atoms/PaginationList/PaginationList';
import Heading from '../../../atoms/Heading/Heading';
import NewsFilterModal from '../../../organisms/user/modal/NewsFilterModal';
import NewsSortModal from '../../../organisms/user/modal/NewsSortModal';
import FilterBtn from '../../../molecules/IconBtn/FilterBtn';
import SortBtn from '../../../molecules/IconBtn/SortBtn';
import styles from '../styles.module.css';

function NewsIndexPage() {
    // urlの設定
    const baseUrl = `/api/user/news`;
    // paramsの適用範囲を決めるscope名を定義
    const model = 'NEWS';
    // URLパラメータ変更のフックの呼び出し
    const {handleCurrentPage} = useCreateParams(model);
    // グローバルステート呼び出し
    const [params, setParams] = useRecoilState(paramState(model));
    // APIと接続して返り値を取得
    const {data, errorMessage} = useFetchApiData2(useCreateUrl(baseUrl, params), model);
    // APIから取得したデータを変数に格納
    const news = data.data ? data.data: null;
    const brands = data.brands? data.brands: null;
    const gender_categories = data.gender_categories? data.gender_categories: null;
    const tags = data.tags? data.tags: null;

    const [popup, setPopup] = useState('');

    useEffect(() => {
        // paramsのデフォルト値と適用範囲を設定
        if(params.scope === null) {
            console.log('NEWSにてparamsの初期値をセット');
            setParams({
                paginate: {},
                sort: { 'posted_at' : '' },
                filter: { 'search' : '', 'tag' : [], 'brand' : [], 'gender_category' : '' },
                scope: model
            });
        }
    },[]);

    
    return (
        <main className={styles.mt_40}>
            <Suspense fallback={<CircularProgress disableShrink />}>
            {
                errorMessage && errorMessage.httpRequestError ? (
                    <Text role='error'>{errorMessage.httpRequestError}</Text>
                ) : (
                    <>
                        {   popup == '1' && 
                            <NewsFilterModal
                                brands={brands}
                                gender_categories={gender_categories}
                                tags={tags}
                                onClick={() => setPopup('')}
                                model={model}
                            />
                        }
                        {   popup == '2' && 
                            <NewsSortModal
                                onClick={() => setPopup('')}
                                model={model}
                            />
                        }

                        <Heading tag={'h1'} tag_style={'h1'} className={styles.section_title}>ニュース一覧</Heading>

                        <div className={styles.form_contents_area}> 
                            <div className={[styles.flex, styles.justify_between, styles.mb_16].join(' ')}>
                                <FilterBtn onClick={() => setPopup('1')} className={styles.filter_sort_btn}>絞り込み</FilterBtn>
                                <SortBtn onClick={() => setPopup('2')} className={styles.filter_sort_btn}>並び替え</SortBtn>
                            </div>
                            {   news &&
                                <div className={styles.mb_24}> 
                                    {                        
                                        news.map((item) =>
                                            <InfoCard
                                                key={item.id}
                                                src={item.thumbnail}
                                                to={`/news/${item.id}`}
                                                title={item.title}
                                                brand_name={item.brand_name}
                                                posted_at={item.posted_at}
                                                modified_at={item.modified_at}
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

export default NewsIndexPage;




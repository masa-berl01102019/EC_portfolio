import React, {Suspense, useEffect, useState} from 'react';
import {CircularProgress} from '@material-ui/core';
import useFetchApiData2 from "../../../hooks/useFetchApiData2";
import useCreateParams from "../../../hooks/useCreateParams";
import { useRecoilState } from 'recoil';
import { paramState } from '../../../store/paramState';
import {useCreateUrl} from "../../../hooks/useCreateUrl";
import Text from '../../../atoms/Text/Text';
import Heading from '../../../atoms/Heading/Heading';
import PaginationList from '../../../atoms/PaginationList/PaginationList';
import InfoCard from '../../../molecules/Card/InfoCard';
import BlogFilterModal from '../../../organisms/user/modal/BlogFilterModal';
import BlogSortModal from '../../../organisms/user/modal/BlogSortModal';
import FilterBtn from '../../../molecules/IconBtn/FilterBtn';
import SortBtn from '../../../molecules/IconBtn/SortBtn';
import styles from '../styles.module.css';

function BlogIndexPage() {
    // urlの設定
    const baseUrl = `/api/user/blogs`;
    // paramsの適用範囲を決めるscope名を定義
    const model = 'BLOG';
    // URLパラメータ変更のフックの呼び出し
    const {handleCurrentPage} = useCreateParams(model);
    // グローバルステート呼び出し
    const [params, setParams] = useRecoilState(paramState(model));
    // APIと接続して返り値を取得
    const {data, errorMessage} = useFetchApiData2(useCreateUrl(baseUrl, params), model);
    // APIから取得したデータを変数に格納
    const blogs = data.data? data.data: null;
    const brands = data.brands? data.brands: null;
    const gender_categories = data.gender_categories? data.gender_categories: null;
    const tags = data.tags? data.tags: null;
    const items = data.items? data.items: null;

    
    const [popup, setPopup] = useState('');

    useEffect(() => {
        // paramsのデフォルト値と適用範囲を設定
        if(params.scope === null) {
            console.log('BLOGにてparamsの初期値をセット');
            setParams({
                paginate: {},
                sort: { 'posted_at' : '' },
                filter: { 'search' : '', 'tag' : [], 'brand' : [], 'item' : [], 'gender_category' : ''},
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
                    <div>
                        {   popup == '1' && 
                            <BlogFilterModal
                                brands={brands}
                                gender_categories={gender_categories}
                                tags={tags}
                                items={items}
                                onClick={() => setPopup('')}
                                model={model}
                            />
                        }
                        {   popup == '2' && 
                            <BlogSortModal
                                onClick={() => setPopup('')}
                                model={model}
                            />
                        }
                        <Heading tag={'h1'} tag_style={'h1'} className={styles.section_title}>ブログ一覧</Heading>

                        <div className={styles.form_contents_area}>


                            <div className={[styles.flex, styles.justify_between, styles.mb_16].join(' ')}>
                                <FilterBtn onClick={() => setPopup('1')} className={styles.filter_sort_btn}>絞り込み</FilterBtn>
                                <SortBtn onClick={() => setPopup('2')} className={styles.filter_sort_btn}>並び替え</SortBtn>
                            </div>

                            {   blogs &&
                                <div className={styles.mb_24}>
                                    {                        
                                        blogs.map((blog) =>
                                            <InfoCard
                                                key={blog.id}
                                                src={blog.thumbnail}
                                                to={`/blogs/${blog.id}`}
                                                title={blog.title}
                                                brand_name={blog.brand_name}
                                                posted_at={blog.posted_at}
                                                modified_at={blog.modified_at}
                                            />
                                        )
                                    }
                                </div>
                            }

                            <PaginationList meta={data.meta} onChange={handleCurrentPage} />

                        </div>
                    </div>
                )
            }
            </Suspense>
        </main>
    );
}

export default BlogIndexPage;




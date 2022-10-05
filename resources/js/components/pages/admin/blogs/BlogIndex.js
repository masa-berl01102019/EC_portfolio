import React, {Suspense, useEffect, useState} from 'react';
import {CircularProgress} from '@material-ui/core';
import useFetchApiData2 from "../../../hooks/useFetchApiData2";
import {useCreateUrl} from "../../../hooks/useCreateUrl";
import Pagination from '../../../molecules/Pagination/Pagination';
import { useRecoilState, useRecoilValue } from 'recoil';
import { paramState } from '../../../store/paramState';
import Heading from '../../../atoms/Heading/Heading';
import BlogTable from '../../../organisms/admin/Table/BlogTable';
import FilterSortBtn from '../../../molecules/IconBtn/FilterSortBtn';
import Text from '../../../atoms/Text/Text';
import BlogSidebar from '../../../organisms/admin/SideBar/BlogSidebar';
import CreateLink from '../../../molecules/IconLink/CreateLink';
import styles from '../styles.module.css';
import { menuAdminState } from '../../../store/menuState';

function BlogIndex() {
    // urlの設定
    const baseUrl = `/api/admin/blogs`;
    // paramsの適用範囲を決めるscope名を定義
    const model = 'BLOG';
    // グローバルステート呼び出し
    const [params, setParams] = useRecoilState(paramState(model));
    // APIと接続して返り値を取得
    const {data, errorMessage, deleteData, getCSVData} = useFetchApiData2(useCreateUrl(baseUrl, params), model);
    // APIから取得したデータを変数に格納
    const blogs = data.data? data.data: null;
    const brands = data.brands? data.brands: null;
    const gender_categories = data.gender_categories? data.gender_categories: null;
    const tags = data.tags? data.tags: null;
    const items = data.items? data.items: null;
    // 検索タブのステータス
    const [open, setOpen] = useState(false);
    // menuの状態管理
    const openAdminMenu = useRecoilValue(menuAdminState);

    useEffect(() => {
        // paramsのデフォルト値と適用範囲を設定
        if(params.scope === null) {
            console.log('BLOGにてparamsの初期値をセット');
            setParams({
                paginate: {},
                sort: { 'posted_at' : '', 'modified_at' : '' },
                filter: { 'search' : '', 'is_published' : '', 'tag' : [], 'brand' : [], 'item' : [], 'gender_category' : '', 'target_span' : '', 'from' : null, 'to' : null },
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
                        {   open && 
                            <BlogSidebar
                                brands={brands}
                                gender_categories={gender_categories}
                                items={items}
                                tags={tags}
                                model={model}
                                onClick={() => setOpen(false)}
                            />
                        }
                        <div className={open ? [styles.open_sidebar, styles.flex_1].join(' ') : styles.flex_1}>

                            <div className={styles.index_title}>
                                <Heading tag={'h1'} tag_style={'h1'} className={styles.mr_auto}>
                                    ブログ一覧 { data.meta && ` ( ${data.meta.total} 件 )`}
                                </Heading>
                                <div className={[styles.flex, styles.btn_area].join(' ')}>
                                    <FilterSortBtn onClick={() => setOpen(!open)} className={styles.mr_16}>詳細検索</FilterSortBtn>
                                    <CreateLink to="/admin/blogs/create">新規登録</CreateLink>
                                </div>
                            </div>
                            
                            <BlogTable blogs={blogs} deleteMethod={deleteData} csvOutputMethod={getCSVData} className={[styles.mb_16, styles.table_scroll_area].join(' ')} />

                            <Pagination meta={data.meta} model={model} />
                        </div>
                    </div>
                )  
            }
            </Suspense>
        </main>
    );
}

export default BlogIndex;




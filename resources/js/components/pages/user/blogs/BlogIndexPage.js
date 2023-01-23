import React, {Suspense, useEffect, useState} from 'react';
import {CircularProgress} from '@material-ui/core';
import useFetchApiData from "../../../hooks/useFetchApiData";
import useCreateParams from "../../../hooks/useCreateParams";
import { useRecoilState } from 'recoil';
import { paramState } from '../../../store/paramState';
import {useCreateUrl} from "../../../hooks/useCreateUrl";
import Heading from '../../../atoms/Heading/Heading';
import PaginationList from '../../../atoms/PaginationList/PaginationList';
import InfoCard from '../../../molecules/Card/InfoCard';
import BlogFilterModal from '../../../organisms/user/modal/BlogFilterModal';
import BlogSortModal from '../../../organisms/user/modal/BlogSortModal';
import FilterBtn from '../../../molecules/IconBtn/FilterBtn';
import SortBtn from '../../../molecules/IconBtn/SortBtn';
import styles from '../styles.module.css';
import useI18next from '../../../context/I18nextContext';

function BlogIndexPage() {

    const baseUrl = `/api/user/blogs`;
    const model = 'BLOG';
    const {handleCurrentPage} = useCreateParams(model);
    const [params, setParams] = useRecoilState(paramState(model));
    const {data, errorMessage} = useFetchApiData(useCreateUrl(baseUrl, params), model);
    const {data:blogs, brands, gender_categories, tags, items} = data;
    const [popup, setPopup] = useState('');
    const i18next = useI18next();

    useEffect(() => {
        if(params.scope === null) {
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
                    <Heading tag={'h1'} tag_style={'h1'} className={styles.section_title}>{i18next.t('user.blog.index-title')}</Heading>

                    <div className={styles.form_contents_area}>


                        <div className={[styles.flex, styles.justify_between, styles.mb_16].join(' ')}>
                            <FilterBtn onClick={() => setPopup('1')} className={styles.filter_sort_btn}>{i18next.t('user.filter')}</FilterBtn>
                            <SortBtn onClick={() => setPopup('2')} className={styles.filter_sort_btn}>{i18next.t('user.sort')}</SortBtn>
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
            </Suspense>
        </main>
    );
}

export default BlogIndexPage;




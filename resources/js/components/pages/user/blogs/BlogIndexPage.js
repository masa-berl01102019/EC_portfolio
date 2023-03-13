import React, { Suspense, useEffect, useState } from 'react';
import { CircularProgress } from '@material-ui/core';
import useFetchApiData from "../../../hooks/useFetchApiData";
import useCreateParams from "../../../hooks/useCreateParams";
import { useCreateUrl } from "../../../hooks/useCreateUrl";
import Heading from '../../../atoms/Heading/Heading';
import PaginationList from '../../../atoms/PaginationList/PaginationList';
import MediaCard from '../../../organisms/user/Card/MediaCard';
import BlogFilterModal from '../../../organisms/user/modal/BlogFilterModal';
import BlogSortModal from '../../../organisms/user/modal/BlogSortModal';
import FilterBtn from '../../../molecules/IconBtn/FilterBtn';
import SortBtn from '../../../molecules/IconBtn/SortBtn';
import styles from '../styles.module.css';
import { useTranslation } from 'react-i18next';
import Text from '../../../atoms/Text/Text';

function BlogIndexPage() {

  const baseUrl = `/api/user/blogs`;
  const model = 'BLOG';
  const { handleCurrentPage, params, setParams } = useCreateParams(model);
  const { data, errorMessage } = useFetchApiData(useCreateUrl(baseUrl, params), model);
  const { data: blogs, brands, gender_categories, tags, items } = data;
  const [popup, setPopup] = useState('');
  const { t } = useTranslation();

  useEffect(() => {
    if (params.scope === null) {
      setParams({
        paginate: {},
        sort: { 'posted_at': '', 'modified_at': '' },
        filter: { 'search': '', 'tag': [], 'brand': [], 'item': [], 'gender_category': '' },
        scope: model
      });
    }
  }, []);

  return (
    <main className={styles.mt_40}>
      <Suspense fallback={<CircularProgress disableShrink />}>
        <Heading tag={'h1'} tag_style={'h1'} className={styles.section_title}>
          {t('user.blog.index-title')}
        </Heading>
        <div className={styles.form_contents_area}>
          <div className={[styles.flex, styles.justify_between, styles.mb_16].join(' ')}>
            <FilterBtn onClick={() => setPopup('1')} className={styles.filter_sort_btn}>
              {t('user.filter')}
            </FilterBtn>
            {popup == '1' &&
              <BlogFilterModal
                brands={brands}
                gender_categories={gender_categories}
                tags={tags}
                items={items}
                onClick={() => setPopup('')}
                model={model}
              />
            }
            <SortBtn onClick={() => setPopup('2')} className={styles.filter_sort_btn}>
              {t('user.sort')}
            </SortBtn>
            {popup == '2' &&
              <BlogSortModal
                onClick={() => setPopup('')}
                model={model}
              />
            }
          </div>
          {blogs.length > 0 ? (
            <div className={styles.mb_24}>
              {blogs.map((blog) =>
                <MediaCard
                  key={blog.id}
                  src={blog.thumbnail}
                  to={`/blogs/${blog.id}`}
                  title={blog.title}
                  brand_name={blog.brand_name}
                  posted_at={blog.posted_at}
                  modified_at={blog.modified_at}
                  related_tags={blog.tags}
                />
              )}
            </div>
          ) : (
            <Text size='l' className={styles.not_found_msg}>
              {t('user.not-found')}
            </Text>
          )}
          <PaginationList meta={data.meta} onChange={handleCurrentPage} />
        </div>
      </Suspense>
    </main>
  );
}

export default BlogIndexPage;
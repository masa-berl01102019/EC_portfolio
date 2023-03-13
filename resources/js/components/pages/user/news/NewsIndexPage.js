import React, { Suspense, useEffect, useState } from 'react';
import { CircularProgress } from '@material-ui/core';
import useCreateParams from "../../../hooks/useCreateParams";
import { useRecoilState } from 'recoil';
import { paramState } from '../../../store/paramState';
import useFetchApiData from '../../../hooks/useFetchApiData';
import { useCreateUrl } from "../../../hooks/useCreateUrl";
import MediaCard from '../../../organisms/user/Card/MediaCard';
import PaginationList from '../../../atoms/PaginationList/PaginationList';
import Heading from '../../../atoms/Heading/Heading';
import NewsFilterModal from '../../../organisms/user/modal/NewsFilterModal';
import NewsSortModal from '../../../organisms/user/modal/NewsSortModal';
import FilterBtn from '../../../molecules/IconBtn/FilterBtn';
import SortBtn from '../../../molecules/IconBtn/SortBtn';
import styles from '../styles.module.css';
import { useTranslation } from 'react-i18next';
import Text from '../../../atoms/Text/Text';

function NewsIndexPage() {

  const baseUrl = `/api/user/news`;
  const model = 'NEWS';
  const { handleCurrentPage } = useCreateParams(model);
  const [params, setParams] = useRecoilState(paramState(model));
  const { data, errorMessage } = useFetchApiData(useCreateUrl(baseUrl, params), model);
  const { data: news, brands, gender_categories, tags } = data;
  const [popup, setPopup] = useState('');
  const { t } = useTranslation();

  useEffect(() => {
    if (params.scope === null) {
      setParams({
        paginate: {},
        sort: { 'posted_at': '', 'modified_at': '' },
        filter: { 'search': '', 'tag': [], 'brand': [], 'gender_category': '' },
        scope: model
      });
    }
  }, []);

  return (
    <main className={styles.mt_40}>
      <Suspense fallback={<CircularProgress disableShrink />}>
        <Heading tag={'h1'} tag_style={'h1'} className={styles.section_title}>{t('user.news.index-title')}</Heading>
        <div className={styles.form_contents_area}>
          <div className={[styles.flex, styles.justify_between, styles.mb_16].join(' ')}>
            <FilterBtn onClick={() => setPopup('1')} className={styles.filter_sort_btn}>{t('user.filter')}</FilterBtn>
            {popup == '1' &&
              <NewsFilterModal
                brands={brands}
                gender_categories={gender_categories}
                tags={tags}
                onClick={() => setPopup('')}
                model={model}
              />
            }
            <SortBtn onClick={() => setPopup('2')} className={styles.filter_sort_btn}>{t('user.sort')}</SortBtn>
            {popup == '2' &&
              <NewsSortModal
                onClick={() => setPopup('')}
                model={model}
              />
            }
          </div>
          {news.length > 0 ? (
            <div className={styles.mb_24}>
              {news.map((item) =>
                <MediaCard
                  key={item.id}
                  src={item.thumbnail}
                  to={`/news/${item.id}`}
                  title={item.title}
                  brand_name={item.brand_name}
                  posted_at={item.posted_at}
                  modified_at={item.modified_at}
                  related_tags={item.tags}
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

export default NewsIndexPage;
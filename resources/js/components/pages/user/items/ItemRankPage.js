import React, { Suspense, useEffect } from 'react';
import { CircularProgress } from '@material-ui/core';
import useFetchApiData from "../../../hooks/useFetchApiData";
import useCreateParams from "../../../hooks/useCreateParams";
import { useRecoilState } from 'recoil';
import { paramState } from '../../../store/paramState';
import { useCreateUrl } from "../../../hooks/useCreateUrl";
import PaginationList from '../../../atoms/PaginationList/PaginationList';
import Heading from '../../../atoms/Heading/Heading';
import styles from '../styles.module.css';
import { useTranslation } from 'react-i18next';
import ItemCardLists from '../../../organisms/user/Cotents/ItemCardLists';

function ItemRankPage() {

  const baseUrl = `/api/user/items/rank`;
  const model = 'RANK';
  const { handleCurrentPage } = useCreateParams(model);
  const [params, setParams] = useRecoilState(paramState(model));
  const { data, errorMessage } = useFetchApiData(useCreateUrl(baseUrl, params), model);
  const items = data.data ? data.data : null;
  const { t } = useTranslation();

  useEffect(() => {
    if (params.scope === null) {
      setParams({
        paginate: {},
        sort: { 'price': '', 'posted_at': '' },
        filter: { 'search': '', 'tag': [], 'color': [], 'size': [], 'brand': [], 'gender_category': '', 'main_category': '', 'sub_category': '' },
        scope: model
      });
    }
  }, []);

  return (
    <main className={styles.mt_40}>
      <Suspense fallback={<CircularProgress disableShrink />}>
        <Heading tag={'h1'} tag_style={'h1'} className={styles.section_title}>
          {t('user.item.rank-title')}
        </Heading>
        <div className={styles.main_contents_area}>
          <ItemCardLists items={items} className={styles.mb_24} />
          <PaginationList meta={data.meta} onChange={handleCurrentPage} />
        </div>
      </Suspense>
    </main>
  );
}

export default ItemRankPage;
import React, { Suspense, useEffect } from 'react';
import { CircularProgress } from '@material-ui/core';
import useFetchApiData from "../../../hooks/useFetchApiData";
import useCreateParams from "../../../hooks/useCreateParams";
import { useCreateUrl } from "../../../hooks/useCreateUrl";
import { useRecoilState } from 'recoil';
import { paramState } from '../../../store/paramState';
import Heading from '../../../atoms/Heading/Heading';
import OrderedItemCard from '../../../organisms/user/Card/OrderedItemCard';
import styles from '../styles.module.css';
import PaginationList from '../../../atoms/PaginationList/PaginationList';
import { useTranslation } from 'react-i18next';
import Text from '../../../atoms/Text/Text';

function OrderIndexPage() {

  const baseUrl = `/api/user/orders`;
  const model = 'ORDER';
  const { handleCurrentPage } = useCreateParams(model);
  const [params, setParams] = useRecoilState(paramState(model));
  const { data, errorMessage, createData } = useFetchApiData(useCreateUrl(baseUrl, params), model);
  const orders = data.data ? data.data : null;
  const { t } = useTranslation();

  useEffect(() => {
    if (params.scope === null) {
      setParams({
        paginate: {},
        scope: model
      });
    }
  }, []);

  return (
    <main className={styles.mt_40}>
      <Suspense fallback={<CircularProgress disableShrink />}>
        <Heading tag={'h1'} tag_style={'h1'} className={styles.section_title}>{t('user.order.index-title')}</Heading>
        <div className={styles.main_contents_area}>
          {orders.length > 0 ? (
            <div className={[styles.flex, styles.flex_wrap, styles.mb_24].join(' ')}>
              {orders.map((order) =>
                <OrderedItemCard
                  key={order.id}
                  order={order}
                  create_method={() => createData({ form: { sku_id: `${order.sku_id}` }, url: `/api/user/carts` })}
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

export default OrderIndexPage;
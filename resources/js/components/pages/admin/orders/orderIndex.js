import React, { useEffect, useState, Suspense } from 'react';
import { CircularProgress } from '@material-ui/core';
import useFetchApiData from "../../../hooks/useFetchApiData";
import { useCreateUrl } from "../../../hooks/useCreateUrl";
import Pagination from '../../../molecules/Pagination/Pagination';
import Heading from '../../../atoms/Heading/Heading';
import OrderTable from '../../../organisms/admin/Table/OrderTable';
import FilterSortBtn from '../../../molecules/IconBtn/FilterSortBtn';
import { useRecoilState, useRecoilValue } from 'recoil';
import { paramState } from '../../../store/paramState';
import OrderSidebar from '../../../organisms/admin/SideBar/OrderSidebar';
import styles from '../styles.module.css';
import { menuAdminState } from '../../../store/menuState';
import { useTranslation } from 'react-i18next';

const OrderIndex = () => {

  const baseUrl = `/api/admin/orders`;
  const model = 'ORDER';
  const [params, setParams] = useRecoilState(paramState(model));
  const { data, errorMessage, deleteData, getCSVData } = useFetchApiData(useCreateUrl(baseUrl, params), model);
  const orders = data.data ? data.data : null;
  const [open, setOpen] = useState(false);
  const openAdminMenu = useRecoilValue(menuAdminState);
  const { t } = useTranslation();

  useEffect(() => {
    if (params.scope === null) {
      setParams({
        paginate: {},
        sort: { 'total_amount': '', 'created_at': '', 'delivery_date': '', 'updated_at': '' },
        filter: { 'search': '', 'payment_method': '', 'is_paid': '', 'is_shipped': '', 'target_span': '', 'from': null, 'to': null },
        scope: model
      });
    }
  }, []);


  return (
    <main>
      <Suspense fallback={<CircularProgress disableShrink />}>
        <div className={openAdminMenu ? [styles.container_open_menu, styles.flex].join(' ') : [styles.container, styles.flex].join(' ')}>
          {open && <OrderSidebar model={model} onClick={() => setOpen(false)} />}
          <div className={open ? [styles.open_sidebar, styles.flex_1].join(' ') : styles.flex_1}>
            <div className={styles.index_title}>
              <Heading tag={'h1'} tag_style={'h1'} className={styles.mr_auto}>
                {t('admin.order.index-title')} {data.meta && ` ( ${data.meta.total} ${t('admin.hits')} )`}
              </Heading>
              <FilterSortBtn onClick={() => setOpen(!open)} className={styles.mr_16}>
                {t('admin.detail-search')}
              </FilterSortBtn>
            </div>
            <OrderTable
              orders={orders}
              deleteMethod={deleteData}
              csvOutputMethod={getCSVData}
              className={[styles.mb_16, styles.table_scroll_area].join(' ')}
            />
            <Pagination meta={data.meta} model={model} />
          </div>
        </div>
      </Suspense>
    </main>
  );
}

export default OrderIndex;
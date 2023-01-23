import React, {Suspense, useEffect, useState} from 'react';
import {CircularProgress} from '@material-ui/core';
import useFetchApiData from "../../../hooks/useFetchApiData";
import {useCreateUrl} from "../../../hooks/useCreateUrl";
import Pagination from '../../../molecules/Pagination/Pagination';
import { useRecoilState, useRecoilValue } from 'recoil';
import { paramState } from '../../../store/paramState';
import Heading from '../../../atoms/Heading/Heading';
import FilterSortBtn from '../../../molecules/IconBtn/FilterSortBtn';
import NotificationTable from '../../../organisms/admin/Table/NotificationTable';
import NotificationSidebar from '../../../organisms/admin/SideBar/NotificationSideBar';
import CreateLink from '../../../molecules/IconLink/CreateLink';
import styles from '../styles.module.css';
import { menuAdminState } from '../../../store/menuState';
import useI18next from '../../../context/I18nextContext';

function NotificationIndex() {

    const baseUrl = `/api/admin/notifications`;
    const model = 'NOTIFICATION';
    const [params, setParams] = useRecoilState(paramState(model));
    const {data, errorMessage, deleteData, getCSVData} = useFetchApiData(useCreateUrl(baseUrl, params), model);
    const notifications = data.data? data.data: null;
    const [open, setOpen] = useState(false);
    const openAdminMenu = useRecoilValue(menuAdminState);
    const i18next = useI18next();

    useEffect(() => {
        if(params.scope === null) {
            setParams({
                paginate: {},
                sort: { 'expired_at' : '', 'posted_at' : '', 'modified_at' : '' },
                filter: { 'search' : '', 'is_published' : '',  'target_span' : '', 'from' : null, 'to' : null },
                scope: model
            });
        }
    },[]);
    
    return (
        <main>
            <Suspense fallback={<CircularProgress disableShrink />}>
                <div className={ openAdminMenu ? [styles.container_open_menu, styles.flex].join(' ') : [styles.container, styles.flex].join(' ') }>
                    { open && <NotificationSidebar model={model} onClick={() => setOpen(false)} /> }
                    <div className={open ? [styles.open_sidebar, styles.flex_1].join(' ') : styles.flex_1}>

                        <div className={styles.index_title}>
                            <Heading tag={'h1'} tag_style={'h1'} className={styles.mr_auto}>
                                {i18next.t('admin.notification.index-title')} { data.meta && ` ( ${data.meta.total} ${i18next.t('admin.hits')} )`}
                            </Heading>
                            <div className={[styles.flex, styles.btn_area].join(' ')}>
                                <FilterSortBtn onClick={() => setOpen(!open)} className={styles.mr_16}>{i18next.t('admin.detail-search')}</FilterSortBtn>
                                <CreateLink to="/admin/notifications/create">{i18next.t('admin.add-new')}</CreateLink>
                            </div>
                        </div>

                        <NotificationTable notifications={notifications} deleteMethod={deleteData} csvOutputMethod={getCSVData} className={[styles.mb_16, styles.table_scroll_area].join(' ')} />
                        
                        <Pagination meta={data.meta} model={model} />
                    </div>
                </div>
            </Suspense>
        </main>
    );
}

export default NotificationIndex;




import React, {Suspense, useEffect, useState} from 'react';
import {CircularProgress} from '@material-ui/core';
import useFetchApiData from "../../../hooks/useFetchApiData";
import {useCreateUrl} from "../../../hooks/useCreateUrl";
import Pagination from '../../../molecules/Pagination/Pagination';
import { useRecoilState, useRecoilValue } from 'recoil';
import { paramState } from '../../../store/paramState';
import Heading from '../../../atoms/Heading/Heading';
import FilterSortBtn from '../../../molecules/IconBtn/FilterSortBtn';
import AdminTable from '../../../organisms/admin/Table/AdminTable';
import AdminSidebar from '../../../organisms/admin/SideBar/AdminSidebar';
import CreateLink from '../../../molecules/IconLink/CreateLink';
import styles from '../styles.module.css';
import { menuAdminState } from '../../../store/menuState';
import { useTranslation } from 'react-i18next';

function AdminIndex() {

    const baseUrl = `/api/admin/admins`;
    const model = 'ADMIN';
    const [params, setParams] = useRecoilState(paramState(model));
    const {data, errorMessage, deleteData, getCSVData} = useFetchApiData(useCreateUrl(baseUrl, params), model);
    const admins = data.data? data.data: null;
    const [open, setOpen] = useState(false);
    const openAdminMenu = useRecoilValue(menuAdminState);
    const { t } = useTranslation();

    useEffect(() => {
        if(params.scope === null) {
            setParams({
                paginate: {},
                sort: { 'last_name_kana' : '', 'created_at' : '', 'updated_at' : '' },
                filter: { 'search' : '',  'target_span' : '', 'from' : null, 'to' : null},
                scope: model
            });
        }
    },[]);
    
    return (
        <main>
            <Suspense fallback={<CircularProgress disableShrink />}>
                <div className={ openAdminMenu ? [styles.container_open_menu, styles.flex].join(' ') : [styles.container, styles.flex].join(' ') }>
                    { open && <AdminSidebar model={model} onClick={() => setOpen(false)} /> }
                    <div className={open ? [styles.open_sidebar, styles.flex_1].join(' ') : styles.flex_1}>

                        <div className={styles.index_title}>
                            <Heading tag={'h1'} tag_style={'h1'} className={styles.mr_auto}>
                                {t('admin.admin.index-title')} { data.meta && ` ( ${data.meta.total} ${t('admin.hits')} )`}
                            </Heading>
                            <div className={[styles.flex, styles.btn_area].join(' ')}>
                                <FilterSortBtn onClick={() => setOpen(!open)} className={styles.mr_16}>{t('admin.detail-search')}</FilterSortBtn>
                                <CreateLink to="/admin/admins/create">{t('admin.add-new')}</CreateLink>
                            </div>
                        </div>

                        <AdminTable admins={admins} deleteMethod={deleteData} csvOutputMethod={getCSVData} className={[styles.mb_16, styles.table_scroll_area].join(' ')} />
                        
                        <Pagination meta={data.meta} model={model} />
                    </div>
                </div>
            </Suspense>
        </main>
    );
}

export default AdminIndex;






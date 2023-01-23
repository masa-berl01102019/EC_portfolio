import React, {Suspense, useEffect, useState} from 'react';
import {CircularProgress} from '@material-ui/core';
import useFetchApiData from "../../../hooks/useFetchApiData";
import {useCreateUrl} from "../../../hooks/useCreateUrl";
import Pagination from '../../../molecules/Pagination/Pagination';
import { useRecoilState, useRecoilValue } from 'recoil';
import { paramState } from '../../../store/paramState';
import Heading from '../../../atoms/Heading/Heading';
import FilterSortBtn from '../../../molecules/IconBtn/FilterSortBtn';
import UserTable from '../../../organisms/admin/Table/UserTable';
import CreateLink from '../../../molecules/IconLink/CreateLink';
import UserSidebar from '../../../organisms/admin/SideBar/UserSidebar';
import styles from '../styles.module.css';
import { menuAdminState } from '../../../store/menuState';
import { useTranslation } from 'react-i18next';

function UserIndex() {

    const baseUrl = `/api/admin/users`;
    const model = 'USER';
    const [params, setParams] = useRecoilState(paramState(model));
    const {data, errorMessage, deleteData, getCSVData} = useFetchApiData(useCreateUrl(baseUrl, params), model);
    const users = data.data ? data.data : null;
    const [open, setOpen] = useState(false);
    const openAdminMenu = useRecoilValue(menuAdminState);
    const { t } = useTranslation();

    useEffect(() => {
        if(params.scope === null) {
            setParams({
                paginate: {},
                sort: { 'last_name_kana' : '', 'birthday' : '', 'created_at' : '', 'updated_at' : ''},
                filter: { 'search' : '', 'gender' : [], 'is_received' : '', 'target_span' : '', 'from' : null, 'to' : null },
                scope: model
            });
        }
    },[]);

    
    return (
        <main>
            <Suspense fallback={<CircularProgress disableShrink />}>
                <div className={ openAdminMenu ? [styles.container_open_menu, styles.flex].join(' ') : [styles.container, styles.flex].join(' ') }>
                    {   open && <UserSidebar model={model} onClick={() => setOpen(false)} /> }
                    <div className={open ? [styles.open_sidebar, styles.flex_1].join(' ') : styles.flex_1}>

                        <div className={styles.index_title}>
                            <Heading tag={'h1'} tag_style={'h1'} className={styles.mr_auto}>
                                {t('admin.user.index-title')} { data.meta && ` ( ${data.meta.total} ${t('admin.hits')} )`}
                            </Heading>
                            <div className={[styles.flex, styles.btn_area].join(' ')}>
                                <FilterSortBtn onClick={() => setOpen(!open)} className={styles.mr_16}>{t('admin.detail-search')}</FilterSortBtn>
                                <CreateLink to="/admin/users/create">{t('admin.add-new')}</CreateLink>
                            </div>
                        </div>

                        <UserTable users={users} deleteMethod={deleteData} csvOutputMethod={getCSVData} className={[styles.mb_16, styles.table_scroll_area].join(' ')} />
                        
                        <Pagination meta={data.meta} model={model} />
                    </div>
                </div>
            </Suspense>
        </main>
    );
}

export default UserIndex;
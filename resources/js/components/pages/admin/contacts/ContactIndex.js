import React, {Suspense, useEffect, useState} from 'react';
import {CircularProgress} from '@material-ui/core';
import useFetchApiData from "../../../hooks/useFetchApiData";
import {useCreateUrl} from "../../../hooks/useCreateUrl";
import Pagination from '../../../molecules/Pagination/Pagination';
import { useRecoilState, useRecoilValue } from 'recoil';
import { paramState } from '../../../store/paramState';
import Heading from '../../../atoms/Heading/Heading';
import FilterSortBtn from '../../../molecules/IconBtn/FilterSortBtn';
import ContactTable from '../../../organisms/admin/Table/ContactTable';
import ContactSidebar from '../../../organisms/admin/SideBar/ContactSidebar';
import styles from '../styles.module.css';
import { menuAdminState } from '../../../store/menuState';
import { useTranslation } from 'react-i18next';

function ContactIndex() {

    const baseUrl = `/api/admin/contacts`;
    const model = 'CONTACT';
    const [params, setParams] = useRecoilState(paramState(model));
    const {data, errorMessage, deleteData, getCSVData} = useFetchApiData(useCreateUrl(baseUrl, params), model);
    const contacts = data.data? data.data: null;
    const [open, setOpen] = useState(false);
    const openAdminMenu = useRecoilValue(menuAdminState);
    const { t } = useTranslation();

    useEffect(() => {
        if(params.scope === null) {
            setParams({
                paginate: {},
                sort: { 'last_name_kana' : '', 'created_at' : '', 'updated_at' : '' },
                filter: { 'search' : '', 'response_status' : [], 'target_span' : '', 'from' : null, 'to' : null },
                scope: model
            });
        }
    },[]);

    
    return (
        <main>
            <Suspense fallback={<CircularProgress disableShrink />}>
                <div className={ openAdminMenu ? [styles.container_open_menu, styles.flex].join(' ') : [styles.container, styles.flex].join(' ') }>
                    {   open && <ContactSidebar model={model} onClick={() => setOpen(false)} /> }
                    <div className={open ? [styles.open_sidebar, styles.flex_1].join(' ') : styles.flex_1}>

                        <div className={styles.index_title}>
                            <Heading tag={'h1'} tag_style={'h1'} className={styles.mr_auto}>
                                {t('admin.contact.index-title')} { data.meta && ` ( ${data.meta.total} ${t('admin.hits')} )`}
                            </Heading>
                            <FilterSortBtn onClick={() => setOpen(!open)}>{t('admin.detail-search')}</FilterSortBtn>
                        </div>

                        <ContactTable contacts={contacts} deleteMethod={deleteData} csvOutputMethod={getCSVData} className={[styles.mb_16, styles.table_scroll_area].join(' ')} />
                        
                        <Pagination meta={data.meta} model={model} />
                    </div>
                </div>
            </Suspense>
        </main>
    );
}

export default ContactIndex;




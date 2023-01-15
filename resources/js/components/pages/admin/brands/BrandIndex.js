import React, {Suspense, useState} from 'react';
import {CircularProgress} from '@material-ui/core';
import useFetchApiData from "../../../hooks/useFetchApiData";
import Heading from '../../../atoms/Heading/Heading';
import styles from '../styles.module.css';
import { useRecoilValue } from 'recoil';
import { menuAdminState } from '../../../store/menuState';
import FormWithBtn from '../../../molecules/Form/FormWithBtn';
import useNotify from '../../../context/NotifyContext';
import Text from '../../../atoms/Text/Text';
import { useTranslation } from 'react-i18next';

function BrandIndex() {

    const baseUrl = `/api/admin/brands`;
    const model = 'BRAND';
    const {data, errorMessage, createData, deleteData, updateData} = useFetchApiData(baseUrl, model);
    const brands = data.brands? data.brands: null;
    const [editableForm, setEeditableForm] = useState(null);
    const openAdminMenu = useRecoilValue(menuAdminState);
    const confirm = useNotify();
    const { t } = useTranslation();

    const handleConfirmDelete = async () => {
        const result = await confirm({
            body : t('admin.brand.confirm-msg'),
            confirmBtnLabel : t('admin.delete-btn')
        });
        result && deleteData({ url:`/api/admin/brands/${editableForm}` });
    }

    return (
        <main>
            <Suspense fallback={<CircularProgress disableShrink />}>
                <div className={ openAdminMenu ? [styles.container_open_menu, styles.max_content].join(' ') : [styles.container, styles.max_content].join(' ') }>
                    <Heading tag={'h1'} tag_style={'h1'} className={styles.mb_16}>{t('admin.brand.index-title')}</Heading>
                    { errorMessage && <Text role='error' size='s'>{errorMessage.brand_name}</Text> }
                    <div className={styles.form_area}>
                        <FormWithBtn
                            name='brand_name'
                            placeholder={t('admin.brand.brand-ex')}
                            formInitialValue={{'brand_name': ''}}
                            validateScope={'admin'}
                            validateConfigKey={'brand_request'}
                            requestUrl={'/api/admin/brands'}
                            createMethod={createData}
                            className={styles.mb_24}
                        />
                        <div className={styles.master_form_area}>
                        { brands && brands.map((brand) =>
                            <div key={brand.id} className={styles.master_text_area}>
                                { brand.id === editableForm ? (
                                    <FormWithBtn
                                        name='brand_name'
                                        placeholder={t('admin.brand.brand-ex')}
                                        formInitialValue={{'brand_name': brand.brand_name}}
                                        validateScope={'admin'}
                                        validateConfigKey={'brand_request'}
                                        requestUrl={`/api/admin/brands/${editableForm}`}
                                        updateMethod={updateData}
                                        deleteMethod={handleConfirmDelete}
                                    />
                                ) : (
                                    <div className={styles.master_editable_text} onClick={() => setEeditableForm(brand.id)}>{brand.brand_name}</div>
                                )}
                            </div>
                        )}
                        </div>
                    </div>
                </div>
            </Suspense>
        </main>
    );
}

export default BrandIndex;




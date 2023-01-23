import React, {Suspense, useState} from 'react';
import {CircularProgress} from '@material-ui/core';
import useFetchApiData from "../../../hooks/useFetchApiData";
import Heading from '../../../atoms/Heading/Heading';
import Text from '../../../atoms/Text/Text';
import styles from '../styles.module.css';
import { useRecoilValue } from 'recoil';
import { menuAdminState } from '../../../store/menuState';
import FormWithBtn from '../../../molecules/Form/FormWithBtn';
import useNotify from '../../../context/NotifyContext';
import { useTranslation } from 'react-i18next';

function ColorIndex() {

    const baseUrl = `/api/admin/colors`;
    const model = 'COLOR';
    const {data, errorMessage, createData, deleteData, updateData} = useFetchApiData(baseUrl, model);
    const colors = data.colors? data.colors: null;
    const [editableForm, setEeditableForm] = useState(null);
    const openAdminMenu = useRecoilValue(menuAdminState);
    const confirm = useNotify();
    const { t } = useTranslation();

    const handleConfirmDelete = async () => {
        const result = await confirm({
            body : t('admin.color.confirm-msg'),
            confirmBtnLabel : t('admin.delete-btn')
        });
        result && deleteData({ url:`/api/admin/colors/${editableForm}` });
    }
    
    return (
        <main>
            <Suspense fallback={<CircularProgress disableShrink />}>
                <div className={ openAdminMenu ? [styles.container_open_menu, styles.max_content].join(' ') : [styles.container, styles.max_content].join(' ') }>
                    <Heading tag={'h1'} tag_style={'h1'} className={styles.mb_16}>{t('admin.color.index-title')}</Heading>
                    { errorMessage && <Text role='error' size='s'>{errorMessage.color_name}</Text> }
                    <div className={styles.form_area}>
                        <FormWithBtn
                            name='color_name'
                            placeholder={t('admin.color.color-ex')}
                            formInitialValue={{'color_name': ''}}
                            validateScope={'admin'}
                            validateConfigKey={'color_request'}
                            requestUrl={'/api/admin/colors'}
                            createMethod={createData}
                            className={styles.mb_24}
                        />
                        <div className={styles.master_form_area}>
                        {   colors && colors.map((color) =>
                            <div key={color.id} className={styles.master_text_area}>
                                { color.id === editableForm ? (
                                    <FormWithBtn
                                        name='color_name'
                                        placeholder={t('admin.color.color-ex')}
                                        formInitialValue={{'color_name': color.color_name}}
                                        validateScope={'admin'}
                                        validateConfigKey={'color_request'}
                                        requestUrl={`/api/admin/colors/${editableForm}`}
                                        updateMethod={updateData}
                                        deleteMethod={handleConfirmDelete}
                                    />
                                ) : (
                                    <div className={styles.master_editable_text} onClick={() => setEeditableForm(color.id)}>{color.color_name}</div>
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

export default ColorIndex;




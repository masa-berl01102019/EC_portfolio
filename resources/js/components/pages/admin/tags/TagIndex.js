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

function TagIndex() {

    const baseUrl = `/api/admin/tags`;
    const model = 'TAG';
    const {data, errorMessage, createData, deleteData, updateData} = useFetchApiData(baseUrl, model);
    const tags = data.tags? data.tags: null;
    const [editableForm, setEeditableForm] = useState(null);
    const openAdminMenu = useRecoilValue(menuAdminState);
    const confirm = useNotify();
    const { t } = useTranslation();

    const handleConfirmDelete = async () => {
        // useNotifyにはpromiseを返却する関数なので返却値を受け取って処理を進める為にasyncでawaitを設定する
        const result = await confirm({
            body : t('admin.tag.confirm-msg'),
            confirmBtnLabel : t('admin.delete-btn')
        });
        // resolveのfunctionで論理値が渡ってくるのそれを受け取って以下の処理をする
        result && deleteData({ url: `/api/admin/tags/${editableForm}`});
    }

    return (
        <main>
            <Suspense fallback={<CircularProgress disableShrink />}>
                <div className={ openAdminMenu ? [styles.container_open_menu, styles.max_content].join(' ') : [styles.container, styles.max_content].join(' ') }>
                    <Heading tag={'h1'} tag_style={'h1'} className={styles.mb_16}>{t('admin.tag.index-title')}</Heading>
                    { errorMessage && <Text role='error' size='s'>{errorMessage.tag_name}</Text> }
                    <div className={styles.form_area}>
                        <FormWithBtn
                            name='tag_name'
                            placeholder={t('admin.tag.tag-ex')}
                            formInitialValue={{'tag_name': ''}}
                            validateScope={'admin'}
                            validateConfigKey={'tag_request'}
                            requestUrl={'/api/admin/tags'}
                            createMethod={createData}
                            className={styles.mb_24}
                        />
                        <div className={styles.master_form_area}>
                        {   tags &&
                            tags.map((tag) =>
                                <div key={tag.id} className={styles.master_text_area}>
                                    { tag.id === editableForm ? (
                                        <FormWithBtn
                                            name='tag_name'
                                            placeholder={t('admin.tag.tag-ex')}
                                            formInitialValue={{'tag_name': tag.tag_name}}
                                            validateScope={'admin'}
                                            validateConfigKey={'tag_request'}
                                            requestUrl={`/api/admin/tags/${editableForm}`}
                                            updateMethod={updateData}
                                            deleteMethod={handleConfirmDelete}
                                        />
                                    ) : (
                                        <div className={styles.master_editable_text} onClick={() => setEeditableForm(tag.id)}>{tag.tag_name}</div>
                                    )}
                                </div>
                            )
                        }
                        </div>
                    </div>
                </div>
            </Suspense>
        </main>
    );
}

export default TagIndex;




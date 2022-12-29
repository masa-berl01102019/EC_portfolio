import React, {memo, useState} from 'react';
import styles from './styles.module.css';
import InputCheckbox from '../../../atoms/InputCheckbox/InputCheckbox';
import useInputCheckBox from '../../../hooks/useInputCheckBox';
import {TableHeadCell as Th} from '../../../atoms/TableHeadCell/TableHeadCell';
import {TableBodyCell as Td} from '../../../atoms/TableBodyCell/TableBodyCell';
import EditLink from '../../../molecules/IconLink/EditLink';
import DeleteBtn from '../../../molecules/IconBtn/DeleteBtn';
import DownloadCsvBtn from '../../../molecules/IconBtn/DownloadCsvBtn';
import { TableRow as Row } from '../../../atoms/TableRow/TableRow';
import useNotify from '../../../context/NotifyContext';
import useI18next from '../../../context/I18nextContext';


const NotificationTable = memo(({notifications, className = '', deleteMethod, csvOutputMethod}) => {

  const [checklist, {setChecklist, handleCheck, handleUnCheckAll, handleCheckAll}] = useInputCheckBox();
  const [checkItemAll, setCheckItemAll] = useState(false);
  const confirm = useNotify();
  const i18next = useI18next();

  const handleConfirmDelete = async () => {
      const result = await confirm({
          body : i18next.t('admin.delete-confirm', {count: checklist.length}),
          confirmBtnLabel : i18next.t('admin.delete-btn')
      });
      result && deleteMethod({url:`/api/admin/notifications`, form:checklist, callback: () => setChecklist([])});
  }

  return (
    <>
      <div style={{'display': 'flex', 'marginBottom': '16px'}}>
        <DeleteBtn onClick={handleConfirmDelete} className={styles.mr}>{i18next.t('admin.delete-all-btn')}</DeleteBtn>
        <DownloadCsvBtn onClick={() => { 
          csvOutputMethod({ 
            url:`/api/admin/notifications/csv`, 
            form:checklist 
          }); 
        }}>{i18next.t('admin.csv-output')}</DownloadCsvBtn>
      </div>
      <div className={className}>
        <table className={styles.table}>
          <thead className={styles.fix_theader} >
            <Row>
              <Th>
                { checkItemAll ? (
                  <InputCheckbox
                    onChange={() => {
                      handleUnCheckAll();
                      setCheckItemAll(false);
                    }} 
                    value={true} 
                    checked={checkItemAll} 
                    className={styles.table_check}
                  />
                ) :(
                  <InputCheckbox 
                    onChange={() => {
                      handleCheckAll(notifications); 
                      setCheckItemAll(true);
                    }} 
                    value={false} 
                    checked={checkItemAll} 
                    className={styles.table_check}
                  />
                )}
              </Th>
              <Th>{i18next.t('admin.id')}</Th>
              <Th>{i18next.t('admin.edit-link')}</Th>
              <Th>{i18next.t('admin.published-status')}</Th>
              <Th>{i18next.t('admin.notification.title')}</Th>
              <Th>{i18next.t('admin.notification.body')}</Th>
              <Th>{i18next.t('admin.last-updated-by')}</Th>
              <Th>{i18next.t('admin.notification.expired-date')}</Th>
              <Th>{i18next.t('admin.posted-date')}</Th>
              <Th>{i18next.t('admin.updated-date')}</Th>
            </Row>
          </thead>
          <tbody>
          { notifications.map((notification) =>
              <Row key={notification.id} className={checklist.includes(notification.id) ? styles.checked_row: ''}>
                <Td><InputCheckbox onChange={handleCheck} value={notification.id} checked={checklist.includes(notification.id)} className={styles.table_check}/></Td>
                <Td>{notification.id}</Td>
                <Td><EditLink to={`/admin/notifications/${notification.id}/edit`}>{i18next.t('admin.edit-link')}</EditLink></Td>
                <Td>{notification.is_published_text}</Td>
                <Td>{notification.title}</Td>
                <Td>{notification.body}</Td>
                <Td>{notification.full_name && notification.full_name_kana && (`${notification.full_name}(${notification.full_name_kana})`)}</Td>
                <Td>{notification.expired_at}</Td>
                <Td>{notification.posted_at}</Td>
                <Td>{notification.modified_at}</Td>
              </Row>
            )
          }
          </tbody>
        </table>
      </div>
    </>
  );
});

export default NotificationTable;
import React, { memo, useState } from 'react';
import styles from './styles.module.css';
import InputCheckbox from '../../../atoms/InputCheckbox/InputCheckbox';
import useInputCheckBox from '../../../hooks/useInputCheckBox';
import { TableHeadCell as Th } from '../../../atoms/TableHeadCell/TableHeadCell';
import { TableBodyCell as Td } from '../../../atoms/TableBodyCell/TableBodyCell';
import EditLink from '../../../molecules/IconLink/EditLink';
import DeleteBtn from '../../../molecules/IconBtn/DeleteBtn';
import DownloadCsvBtn from '../../../molecules/IconBtn/DownloadCsvBtn';
import { TableRow as Row } from '../../../atoms/TableRow/TableRow';
import useNotify from '../../../context/NotifyContext';
import { useTranslation } from 'react-i18next';
import Text from '../../../atoms/Text/Text';


const NotificationTable = memo(({ notifications, className = '', deleteMethod, csvOutputMethod }) => {

  const [checklist, { setChecklist, handleCheck, handleUnCheckAll, handleCheckAll }] = useInputCheckBox();
  const [checkItemAll, setCheckItemAll] = useState(false);
  const confirm = useNotify();
  const { t } = useTranslation();

  const handleConfirmDelete = async () => {
    const result = await confirm({
      body: t('admin.delete-confirm', { count: checklist.length }),
      confirmBtnLabel: t('admin.delete-btn')
    });
    result && deleteMethod({ url: `/api/admin/notifications`, form: checklist, callback: () => setChecklist([]) });
  }

  const handleCheckboxState = () => {
    if (checkItemAll) {
      handleUnCheckAll();
      setCheckItemAll(false);
    } else {
      handleCheckAll(notifications);
      setCheckItemAll(true);
    }
  }

  return (
    <>
      <div style={{ 'display': 'flex', 'marginBottom': '16px' }}>
        <DeleteBtn onClick={handleConfirmDelete} className={styles.mr}>{t('admin.delete-all-btn')}</DeleteBtn>
        <DownloadCsvBtn onClick={() => csvOutputMethod({ url: `/api/admin/notifications/csv`, form: checklist })}>
          {t('admin.csv-output')}
        </DownloadCsvBtn>
      </div>
      <div className={className}>
        <table className={styles.table}>
          <thead className={styles.fix_theader} >
            <Row>
              <Th>
                <InputCheckbox
                  onChange={handleCheckboxState}
                  value={checkItemAll ? true : false}
                  checked={checkItemAll}
                  className={styles.table_check}
                />
              </Th>
              <Th>{t('admin.id')}</Th>
              <Th>{t('admin.edit-link')}</Th>
              <Th>{t('admin.published-status')}</Th>
              <Th>{t('admin.notification.title')}</Th>
              <Th>{t('admin.notification.body')}</Th>
              <Th>{t('admin.last-updated-by')}</Th>
              <Th>{t('admin.notification.expired-date')}</Th>
              <Th>{t('admin.posted-date')}</Th>
              <Th>{t('admin.updated-date')}</Th>
            </Row>
          </thead>
          <tbody>
            {notifications.map((notification) =>
              <Row key={notification.id} className={checklist.includes(notification.id) ? styles.checked_row : ''}>
                <Td>
                  <InputCheckbox
                    onChange={handleCheck}
                    value={notification.id}
                    checked={checklist.includes(notification.id)}
                    className={styles.table_check}
                  />
                </Td>
                <Td>{notification.id}</Td>
                <Td><EditLink to={`/admin/notifications/${notification.id}/edit`}>{t('admin.edit-link')}</EditLink></Td>
                <Td>{notification.is_published_text}</Td>
                <Td>{notification.title}</Td>
                <Td>{notification.body}</Td>
                <Td>
                  <Text tag='span'>{notification.full_name}</Text>
                  <Text tag='span'>
                    {notification.full_name_kana.trim() !== '' && `(${notification.full_name_kana})`}
                  </Text>
                </Td>
                <Td>{notification.expired_at}</Td>
                <Td>{notification.posted_at}</Td>
                <Td>{notification.modified_at}</Td>
              </Row>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
});

export default NotificationTable;
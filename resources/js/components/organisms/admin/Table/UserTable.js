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


const UserTable = memo(({ users, className = '', deleteMethod, csvOutputMethod }) => {

  const [checklist, { setChecklist, handleCheck, handleUnCheckAll, handleCheckAll }] = useInputCheckBox();
  const [checkItemAll, setCheckItemAll] = useState(false);
  const confirm = useNotify();
  const { t } = useTranslation();

  const handleConfirmDelete = async () => {
    const result = await confirm({
      body: t('admin.delete-confirm', { count: checklist.length }),
      confirmBtnLabel: t('admin.delete-btn')
    });
    result && deleteMethod({ url: `/api/admin/users`, form: checklist, callback: () => setChecklist([]) });
  }

  const handleCheckboxState = () => {
    if (checkItemAll) {
      handleUnCheckAll();
      setCheckItemAll(false);
    } else {
      handleCheckAll(users);
      setCheckItemAll(true);
    }
  }

  return (
    <>
      <div style={{ 'display': 'flex', 'marginBottom': '16px' }}>
        <DeleteBtn onClick={handleConfirmDelete} className={styles.mr}>{t('admin.delete-all-btn')}</DeleteBtn>
        <DownloadCsvBtn onClick={() => csvOutputMethod({ url: `/api/admin/users/csv`, form: checklist })}>
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
              <Th>{t('admin.user.name')}</Th>
              <Th>{t('admin.user.name-kana')}</Th>
              <Th>{t('admin.user.gender')}</Th>
              <Th>{t('admin.user.birthday')}</Th>
              <Th>{t('admin.user.postcode')}</Th>
              <Th>{t('admin.user.address')}</Th>
              <Th>{t('admin.user.delivery-postcode')}</Th>
              <Th>{t('admin.user.delivery-address')}</Th>
              <Th>{t('admin.user.tel-table')}</Th>
              <Th>{t('admin.user.email')}</Th>
              <Th>{t('admin.user.dm-register')}</Th>
              <Th>{t('admin.created-date')}</Th>
              <Th>{t('admin.updated-date')}</Th>
            </Row>
          </thead>
          <tbody>
            {users.map((user) =>
              <Row key={user.id} className={checklist.includes(user.id) ? styles.checked_row : ''}>
                <Td>
                  <InputCheckbox
                    onChange={handleCheck}
                    value={user.id}
                    checked={checklist.includes(user.id)}
                    className={styles.table_check}
                  />
                </Td>
                <Td>{user.id}</Td>
                <Td><EditLink to={`/admin/users/${user.id}/edit`}>{t('admin.edit-link')}</EditLink></Td>
                <Td>{user.full_name}</Td>
                <Td>{user.full_name_kana}</Td>
                <Td>{user.gender_text}</Td>
                <Td>{user.birthday}</Td>
                <Td>{user.post_code_text}</Td>
                <Td>{user.full_address}</Td>
                <Td>{user.delivery_post_code_text}</Td>
                <Td>{user.full_delivery_address}</Td>
                <Td>{user.tel}</Td>
                <Td>{user.email}</Td>
                <Td>{user.is_received_text}</Td>
                <Td>{user.created_at}</Td>
                <Td>{user.updated_at}</Td>
              </Row>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
});


export default UserTable;
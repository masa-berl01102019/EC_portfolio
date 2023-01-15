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
import { useTranslation } from 'react-i18next';


const AdminTable = ({admins, className = '', deleteMethod, csvOutputMethod}) => {

  const [checklist, {setChecklist, handleCheck, handleUnCheckAll, handleCheckAll}] = useInputCheckBox();
  const [checkItemAll, setCheckItemAll] = useState(false);
  const confirm = useNotify();
  const { t } = useTranslation();

  const handleConfirmDelete = async () => {
      const result = await confirm({
          body : t('admin.delete-confirm', {count: checklist.length}),
          confirmBtnLabel : t('admin.delete-btn')
      });
      result && deleteMethod({url:`/api/admin/admins`, form:checklist, callback: () => setChecklist([])});
  }

  return (
    <>
      <div style={{'display': 'flex', 'marginBottom': '16px'}}>
        <DeleteBtn onClick={handleConfirmDelete} className={styles.mr}>{t('admin.delete-all-btn')}</DeleteBtn>
        <DownloadCsvBtn onClick={() => { 
          csvOutputMethod({ 
            url:`/api/admin/admins/csv`, 
            form:checklist 
          }); 
        }}>{t('admin.csv-output')}</DownloadCsvBtn>
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
                      handleCheckAll(admins); 
                      setCheckItemAll(true);
                    }} 
                    value={false} 
                    checked={checkItemAll} 
                    className={styles.table_check}
                  />
                )}
              </Th>
              <Th>{t('admin.id')}</Th>
              <Th>{t('admin.edit-link')}</Th>
              <Th>{t('admin.admin.name')}</Th>
              <Th>{t('admin.admin.name-kana')}</Th>
              <Th>{t('admin.admin.tel')}</Th>
              <Th>{t('admin.admin.email')}</Th>
              <Th>{t('admin.created-date')}</Th>
              <Th>{t('admin.updated-date')}</Th>
            </Row>
          </thead>
          <tbody>
          { admins.map((admin) =>
              <Row key={admin.id} className={checklist.includes(admin.id) ? styles.checked_row: ''}>
                <Td><InputCheckbox onChange={handleCheck} value={admin.id} checked={checklist.includes(admin.id)} className={styles.table_check}/></Td>
                <Td>{admin.id}</Td>
                <Td><EditLink to={`/admin/admins/${admin.id}/edit`}>{t('admin.edit-link')}</EditLink></Td>
                <Td>{admin.full_name}</Td>
                <Td>{admin.full_name_kana}</Td>
                <Td>{admin.tel}</Td>
                <Td>{admin.email}</Td>
                <Td>{admin.created_at}</Td>
                <Td>{admin.updated_at}</Td>
              </Row>
            )
          }
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AdminTable;
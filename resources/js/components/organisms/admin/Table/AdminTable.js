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


const AdminTable = memo(({admins, className = '', deleteMethod, csvOutputMethod}) => {

  const [checklist, {setChecklist, handleCheck, handleUnCheckAll, handleCheckAll}] = useInputCheckBox();
  const [checkItemAll, setCheckItemAll] = useState(false);
  const confirm = useNotify();
  const i18next = useI18next();

  const handleConfirmDelete = async () => {
      const result = await confirm({
          body : i18next.t('admin.delete-confirm', {count: checklist.length}),
          confirmBtnLabel : i18next.t('admin.delete-btn')
      });
      result && deleteMethod({url:`/api/admin/admins`, form:checklist, callback: () => setChecklist([])});
  }

  return (
    <>
      <div style={{'display': 'flex', 'marginBottom': '16px'}}>
        <DeleteBtn onClick={handleConfirmDelete} className={styles.mr}>{i18next.t('admin.delete-all-btn')}</DeleteBtn>
        <DownloadCsvBtn onClick={() => { 
          csvOutputMethod({ 
            url:`/api/admin/admins/csv`, 
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
                      handleCheckAll(admins); 
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
              <Th>{i18next.t('admin.admin.name')}</Th>
              <Th>{i18next.t('admin.admin.name-kana')}</Th>
              <Th>{i18next.t('admin.admin.tel')}</Th>
              <Th>{i18next.t('admin.admin.email')}</Th>
              <Th>{i18next.t('admin.created-date')}</Th>
              <Th>{i18next.t('admin.updated-date')}</Th>
            </Row>
          </thead>
          <tbody>
          { admins.map((admin) =>
              <Row key={admin.id} className={checklist.includes(admin.id) ? styles.checked_row: ''}>
                <Td><InputCheckbox onChange={handleCheck} value={admin.id} checked={checklist.includes(admin.id)} className={styles.table_check}/></Td>
                <Td>{admin.id}</Td>
                <Td><EditLink to={`/admin/admins/${admin.id}/edit`}>{i18next.t('admin.edit-link')}</EditLink></Td>
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
});

export default AdminTable;
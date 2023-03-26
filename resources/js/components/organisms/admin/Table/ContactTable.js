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
import useHelper from '../../../hooks/useHelper';


const ContactTable = memo(({ contacts, className = '', deleteMethod, csvOutputMethod }) => {

  const [checklist, { setChecklist, handleCheck, handleUnCheckAll, handleCheckAll }] = useInputCheckBox();
  const [checkItemAll, setCheckItemAll] = useState(false);
  const confirm = useNotify();
  const { t } = useTranslation();
  const { check } = useHelper();

  const handleConfirmDelete = async () => {
    const result = await confirm({
      body: t('admin.delete-confirm', { count: checklist.length }),
      confirmBtnLabel: t('admin.delete-btn')
    });
    result && deleteMethod({ url: `/api/admin/contacts`, form: checklist, callback: () => setChecklist([]) });
  }

  const handleCheckboxState = () => {
    if (checkItemAll) {
      handleUnCheckAll();
      setCheckItemAll(false);
    } else {
      handleCheckAll(contacts);
      setCheckItemAll(true);
    }
  }

  return (
    <>
      <div style={{ 'display': 'flex', 'marginBottom': '16px' }}>
        <DeleteBtn onClick={handleConfirmDelete} className={styles.mr}>{t('admin.delete-all-btn')}</DeleteBtn>
        <DownloadCsvBtn onClick={() => csvOutputMethod({ url: `/api/admin/contacts/csv`, form: checklist })}>
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
              <Th>{t('admin.contact.user-id')}</Th>
              <Th>{t('admin.contact.name')}</Th>
              <Th>{t('admin.contact.name-kana')}</Th>
              <Th>{t('admin.contact.tel')}</Th>
              <Th>{t('admin.contact.email')}</Th>
              <Th>{t('admin.contact.contacted-date')}</Th>
              <Th>{t('admin.contact.subject')}</Th>
              <Th>{t('admin.contact.message')}</Th>
              <Th>{t('admin.contact.response-status')}</Th>
              <Th>{t('admin.contact.admin-name')}</Th>
              <Th>{t('admin.contact.memo')}</Th>
              <Th>{t('admin.updated-date')}</Th>
            </Row>
          </thead>
          <tbody>
            {contacts.map((contact) =>
              <Row key={contact.id} className={checklist.includes(contact.id) ? styles.checked_row : ''}>
                <Td>
                  <InputCheckbox
                    onChange={handleCheck}
                    value={contact.id}
                    checked={checklist.includes(contact.id)}
                    className={styles.table_check}
                  />
                </Td>
                <Td>{contact.id}</Td>
                <Td><EditLink to={`/admin/contacts/${contact.id}/edit`}>{t('admin.edit-link')}</EditLink></Td>
                <Td>{contact.user_id}</Td>
                <Td>{contact.full_name}</Td>
                <Td>{contact.full_name_kana}</Td>
                <Td>{contact.tel}</Td>
                <Td>{contact.email}</Td>
                <Td>{contact.created_at}</Td>
                <Td>{contact.subject}</Td>
                <Td>{contact.message}</Td>
                <Td>{contact.response_status_text}</Td>
                <Td>
                  <Text tag='span'>{contact.admin_full_name && contact.admin_full_name}</Text>
                  <Text tag='span'>
                    {check(contact.admin_full_name_kana) && `(${contact.admin_full_name_kana})`}
                  </Text>
                </Td>
                <Td>{contact.memo}</Td>
                <Td>{contact.updated_at}</Td>
              </Row>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
});


export default ContactTable;
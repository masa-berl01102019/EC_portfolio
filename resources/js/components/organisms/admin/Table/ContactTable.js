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


const ContactTable = memo(({contacts, className = '', deleteMethod, csvOutputMethod}) => {

  // テーブルのデータに対しての操作の関心を分ける
  const [checklist, {setChecklist, handleCheck, handleUnCheckAll, handleCheckAll}] = useInputCheckBox();

  const [checkItemAll, setCheckItemAll] = useState(false);

    // notifyContextの呼び出し
    const confirm = useNotify();

    const handleConfirmDelete = async () => {
        const result = await confirm({
            body : `選択項目${checklist.length}件を削除しますか？`,
            confirmBtnLabel : '削除'
        });
        result && deleteMethod({url:`/api/admin/contacts`, form:checklist, callback: () => setChecklist([])});
    }

  return (
    <>
      <div style={{'display': 'flex', 'marginBottom': '16px'}}>
        <DeleteBtn onClick={handleConfirmDelete} className={styles.mr}>一括削除</DeleteBtn>
        <DownloadCsvBtn onClick={() => { 
          csvOutputMethod({ 
            url:`/api/admin/contacts/csv`, 
            form:checklist 
          }); 
        }}>CSV出力</DownloadCsvBtn>
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
                      handleCheckAll(contacts); 
                      setCheckItemAll(true);
                    }} 
                    value={false} 
                    checked={checkItemAll} 
                    className={styles.table_check}
                  />
                )}
              </Th>
              <Th>ID</Th>
              <Th>編集</Th>
              <Th>会員ID</Th>
              <Th>氏名</Th>
              <Th>氏名(カナ)</Th>
              <Th>電話番号</Th>
              <Th>メールアドレス</Th>
              <Th>お問い合わせ日</Th>
              <Th>タイトル</Th>
              <Th>お問い合わせ内容</Th>
              <Th>対応状況</Th>
              <Th>対応者</Th>
              <Th>備考欄</Th>
              <Th>対応日</Th>
            </Row>
          </thead>
          <tbody>
          { contacts.map((contact) =>
              <Row key={contact.id} className={checklist.includes(contact.id) ? styles.checked_row: ''}>
                <Td><InputCheckbox onChange={handleCheck} value={contact.id} checked={checklist.includes(contact.id)} className={styles.table_check}/></Td>
                <Td>{contact.id}</Td>
                <Td><EditLink to={`/admin/contacts/${contact.id}/edit`}>編集</EditLink></Td>
                <Td>{contact.user_id}</Td>
                <Td>{contact.full_name}</Td>
                <Td>{contact.full_name_kana}</Td>
                <Td>{contact.tel}</Td>
                <Td>{contact.email}</Td>
                <Td>{contact.created_at}</Td>
                <Td>{contact.title}</Td>
                <Td>{contact.body}</Td>
                <Td>{contact.response_status_text}</Td>
                <Td>{contact.admin_full_name && contact.admin_full_name_kana && (`${contact.admin_full_name}(${contact.admin_full_name_kana})`)}</Td>
                <Td>{contact.memo}</Td>
                <Td>{contact.updated_at}</Td>
              </Row>
            )
          }
          </tbody>
        </table>
      </div>
    </>
  );
});


export default ContactTable;
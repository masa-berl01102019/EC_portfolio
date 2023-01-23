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


const UserTable = memo(({users, className = '', deleteMethod, csvOutputMethod}) => {

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
      result && deleteMethod({url:`/api/admin/users`, form:checklist, callback: () => setChecklist([])});
  }

  return (
    <>
      <div style={{'display': 'flex', 'marginBottom': '16px'}}>
        <DeleteBtn onClick={handleConfirmDelete} className={styles.mr}>一括削除</DeleteBtn>
        <DownloadCsvBtn onClick={() => { 
          csvOutputMethod({ 
            url:`/api/admin/users/csv`, 
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
                      handleCheckAll(users); 
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
              <Th>氏名</Th>
              <Th>氏名(カナ)</Th>
              <Th>性別</Th>
              <Th>生年月日</Th>
              <Th>郵便番号</Th>
              <Th>住所</Th>
              <Th>配送先-郵便番号</Th>
              <Th>配送先-住所</Th>
              <Th>電話番号</Th>
              <Th>メールアドレス</Th>
              <Th>DM登録</Th>
              <Th>作成日時</Th>
              <Th>更新日時</Th>
            </Row>
          </thead>
          <tbody>
          { users.map((user) =>
              <Row key={user.id} className={checklist.includes(user.id) ? styles.checked_row: ''}>
                <Td><InputCheckbox onChange={handleCheck} value={user.id} checked={checklist.includes(user.id)} className={styles.table_check}/></Td>
                <Td>{user.id}</Td>
                <Td><EditLink to={`/admin/users/${user.id}/edit`}>編集</EditLink></Td>
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
            )
          }
          </tbody>
        </table>
      </div>
    </>
  );
});


export default UserTable;
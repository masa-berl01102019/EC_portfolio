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


const AdminTable = memo(({admins, className = '', deleteMethod, csvOutputMethod}) => {

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
      result && deleteMethod({url:`/api/admin/admins`, form:checklist, callback: () => setChecklist([])});
  }

  return (
    <>
      <div style={{'display': 'flex', 'marginBottom': '16px'}}>
        <DeleteBtn onClick={handleConfirmDelete} className={styles.mr}>一括削除</DeleteBtn>
        <DownloadCsvBtn onClick={() => { 
          csvOutputMethod({ 
            url:`/api/admin/admins/csv`, 
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
                      handleCheckAll(admins); 
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
              <Th>電話番号</Th>
              <Th>メールアドレス</Th>
              <Th>作成日時</Th>
              <Th>更新日時</Th>
            </Row>
          </thead>
          <tbody>
          { admins.map((admin) =>
              <Row key={admin.id} className={checklist.includes(admin.id) ? styles.checked_row: ''}>
                <Td><InputCheckbox onChange={handleCheck} value={admin.id} checked={checklist.includes(admin.id)} className={styles.table_check}/></Td>
                <Td>{admin.id}</Td>
                <Td><EditLink to={`/admin/admins/${admin.id}/edit`}>編集</EditLink></Td>
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
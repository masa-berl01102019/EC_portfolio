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


const NotificationTable = memo(({notifications, className = '', deleteMethod, csvOutputMethod}) => {

  // テーブルのデータに対しての操作の関心を分ける
  const [checklist, {setChecklist, handleCheck, handleUnCheckAll, handleCheckAll}] = useInputCheckBox();

  const [checkItemAll, setCheckItemAll] = useState(false);

  return (
    <>
      <div style={{'display': 'flex', 'marginBottom': '16px'}}>
        <DeleteBtn onClick={() => {
            let answer = confirm(`選択項目${checklist.length}件を削除しますか？`);
            answer && deleteMethod({url:`/api/admin/notifications`, form:checklist, callback: () => setChecklist([])});
        }} className={styles.mr}>一括削除</DeleteBtn>
        <DownloadCsvBtn onClick={() => { 
          csvOutputMethod({ 
            url:`/api/admin/notifications/csv`, 
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
                      handleCheckAll(notifications); 
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
              <Th>公開状況</Th>
              <Th>タイトル</Th>
              <Th>本文</Th>
              <Th>最終更新者</Th>
              <Th>掲載終了日</Th>
              <Th>投稿日</Th>
              <Th>更新日</Th>
            </Row>
          </thead>
          <tbody>
          { notifications.map((notification) =>
              <Row key={notification.id} className={checklist.includes(notification.id) ? styles.checked_row: ''}>
                <Td><InputCheckbox onChange={handleCheck} value={notification.id} checked={checklist.includes(notification.id)} className={styles.table_check}/></Td>
                <Td>{notification.id}</Td>
                <Td><EditLink to={`/admin/notifications/${notification.id}/edit`}>編集</EditLink></Td>
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
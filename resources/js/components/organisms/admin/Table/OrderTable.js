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


const OrderTable = memo(({orders, className = '', deleteMethod, csvOutputMethod}) => {

  // テーブルのデータに対しての操作の関心を分ける
  const [checklist, {setChecklist, handleCheck, handleUnCheckAll, handleCheckAll}] = useInputCheckBox();

  const [checkItemAll, setCheckItemAll] = useState(false);

  return (
    <>
      <div style={{'display': 'flex', 'marginBottom': '16px'}}>
        <DeleteBtn onClick={() => {
            let answer = confirm(`選択項目${checklist.length}件を削除しますか？`);
            answer && deleteMethod({url:`/api/admin/orders`, form:checklist, callback: () => setChecklist([])});
        }} className={styles.mr}>一括削除</DeleteBtn>
        <DownloadCsvBtn onClick={() => { 
          csvOutputMethod({ 
            url:`/api/admin/orders/csv`, 
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
                      handleCheckAll(orders); 
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
              <Th>購入日</Th>
              <Th>購入金額</Th>
              <Th>支払方法</Th>
              <Th>希望配達日</Th>
              <Th>希望配達時間帯</Th>
              <Th>入金状況</Th>
              <Th>出荷状況</Th>
              <Th>購入者(カナ)</Th>
              <Th>連絡先</Th>
              <Th>メールアドレス</Th>
              <Th>配送先 郵便番号</Th>
              <Th>配送先 住所</Th>
              <Th>ステータス更新日</Th>
            </Row>
          </thead>
          <tbody>
          { orders.map((order) =>
              <Row key={order.id} className={checklist.includes(order.id) ? styles.checked_row: ''}>
                <Td><InputCheckbox onChange={handleCheck} value={order.id} checked={checklist.includes(order.id)} className={styles.table_check}/></Td>
                <Td>{order.id}</Td>
                <Td><EditLink to={`/admin/orders/${order.id}/edit`}>編集</EditLink></Td>
                <Td>{order.created_at}</Td>
                <Td>{order.total_amount_text}</Td>
                <Td>{order.payment_method_text}</Td>
                <Td>{order.delivery_date}</Td>
                <Td>{order.delivery_time}</Td>
                <Td>{order.is_paid_text}</Td>
                <Td>{order.is_shipped_text}</Td>
                <Td>{order.full_name && order.full_name_kana && (`${order.full_name}(${order.full_name_kana})`)}</Td>
                <Td>{order.tel}</Td>
                <Td>{order.email}</Td>
                {/* 配送先住所が設定されていた場合はそちらを優先する */}
                <Td>{order.delivery_post_code_text ? order.delivery_post_code_text : order.post_code_text}</Td>
                <Td>{order.full_delivery_address ? order.full_delivery_address : order.full_address}</Td>
                <Td>{order.updated_at}</Td>
              </Row>
            )
          }
          </tbody>
        </table>
      </div>
    </>
  );
});

export default OrderTable;
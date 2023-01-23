import React, {memo} from 'react';
import styles from './styles.module.css';
import {TableHeadCell as Th} from '../../../atoms/TableHeadCell/TableHeadCell';
import {TableBodyCell as Td} from '../../../atoms/TableBodyCell/TableBodyCell';
import { TableRow as Row } from '../../../atoms/TableRow/TableRow';


const ItemOrderTable = ({order, className = ''}) => {

  return (
    <>
      <table className={[styles.table, className].join(' ')}>
        <thead>
          <Row>
            <Th className={styles.th_order}>品番</Th>
            <Th className={styles.th_order}>商品名</Th>
            <Th className={styles.th_order}>カラー</Th>
            <Th className={styles.th_order}>サイズ</Th>
            <Th className={styles.th_order}>価格</Th>
            <Th className={styles.th_order}>数量</Th>
          </Row>
        </thead>
        <tbody>
        {   order && order.order_details &&
            order.order_details.map(list =>
                <Row key={list.id}>
                    <Td className={styles.td_order}>{list.product_number}</Td>
                    <Td className={styles.td_order}>{list.item_name}</Td>
                    <Td className={styles.td_order}>{list.order_color}</Td>
                    <Td className={styles.td_order}>{list.order_size}</Td>
                    <Td className={styles.td_order}>{list.order_price}</Td>
                    <Td className={styles.td_order}>{list.order_quantity}</Td>
                </Row>
            )
        }
        </tbody>
      </table>
    </>
  );
};

export default ItemOrderTable;
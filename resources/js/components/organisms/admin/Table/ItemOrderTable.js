import React, {memo} from 'react';
import styles from './styles.module.css';
import {TableHeadCell as Th} from '../../../atoms/TableHeadCell/TableHeadCell';
import {TableBodyCell as Td} from '../../../atoms/TableBodyCell/TableBodyCell';
import { TableRow as Row } from '../../../atoms/TableRow/TableRow';
import useI18next from '../../../context/I18nextContext';


const ItemOrderTable = ({order, className = ''}) => {

  const i18next = useI18next();

  return (
    <>
      <table className={[styles.table, className].join(' ')}>
        <thead>
          <Row>
            <Th className={styles.th_order}>{i18next.t('admin.order.product-number')}</Th>
            <Th className={styles.th_order}>{i18next.t('admin.order.item-name')}</Th>
            <Th className={styles.th_order}>{i18next.t('admin.order.color')}</Th>
            <Th className={styles.th_order}>{i18next.t('admin.order.size')}</Th>
            <Th className={styles.th_order}>{i18next.t('admin.order.price')}</Th>
            <Th className={styles.th_order}>{i18next.t('admin.order.quantity')}</Th>
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
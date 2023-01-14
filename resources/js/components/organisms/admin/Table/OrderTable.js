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


const OrderTable = ({orders, className = '', deleteMethod, csvOutputMethod}) => {

  const [checklist, {setChecklist, handleCheck, handleUnCheckAll, handleCheckAll}] = useInputCheckBox();
  const [checkItemAll, setCheckItemAll] = useState(false);
  const confirm = useNotify();
  const i18next = useI18next();

  const handleConfirmDelete = async () => {
      const result = await confirm({
          body : i18next.t('admin.delete-confirm', {count: checklist.length}),
          confirmBtnLabel : i18next.t('admin.delete-btn')
      });
      result && deleteMethod({url:`/api/admin/orders`, form:checklist, callback: () => setChecklist([])});
  }

  return (
    <>
      <div style={{'display': 'flex', 'marginBottom': '16px'}}>
        {/* API側の調整が必要な為 */}
        {/* <DeleteBtn onClick={handleConfirmDelete} className={styles.mr}>{i18next.t('admin.delete-all-btn')}</DeleteBtn> */}
        <DownloadCsvBtn onClick={() => { 
          csvOutputMethod({ 
            url:`/api/admin/orders/csv`, 
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
                      handleCheckAll(orders); 
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
              <Th>{i18next.t('admin.order.purchase-date')}</Th>
              <Th>{i18next.t('admin.order.purchase-amount')}</Th>
              <Th>{i18next.t('admin.order.payment-method')}</Th>
              <Th>{i18next.t('admin.order.payment-token')}</Th>
              <Th>{i18next.t('admin.order.preferred-delivery-day')}</Th>
              <Th>{i18next.t('admin.order.preferred-delivery-time')}</Th>
              <Th>{i18next.t('admin.order.payment-status')}</Th>
              <Th>{i18next.t('admin.order.delivery-status')}</Th>
              <Th>{i18next.t('admin.order.name')}</Th>
              <Th>{i18next.t('admin.order.tel')}</Th>
              <Th>{i18next.t('admin.order.email')}</Th>
              <Th>{i18next.t('admin.order.delivery-postcode')}</Th>
              <Th>{i18next.t('admin.order.delivery-address')}</Th>
              <Th>{i18next.t('admin.updated-date')}</Th>
            </Row>
          </thead>
          <tbody>
          { orders.map((order) =>
              <Row key={order.id} className={checklist.includes(order.id) ? styles.checked_row: ''}>
                <Td><InputCheckbox onChange={handleCheck} value={order.id} checked={checklist.includes(order.id)} className={styles.table_check}/></Td>
                <Td>{order.id}</Td>
                <Td><EditLink to={`/admin/orders/${order.id}/edit`}>{i18next.t('admin.edit-link')}</EditLink></Td>
                <Td>{order.created_at}</Td>
                <Td>{order.total_amount_text}</Td>
                <Td>{order.payment_method_text}</Td>
                <Td>{order.payment_token}</Td>
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
};

export default OrderTable;
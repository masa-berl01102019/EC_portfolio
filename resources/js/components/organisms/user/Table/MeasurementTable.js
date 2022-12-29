import React, {memo} from 'react';
import styles from './styles.module.css';
import {TableHeadCell as Th} from '../../../atoms/TableHeadCell/TableHeadCell';
import {TableBodyCell as Td} from '../../../atoms/TableBodyCell/TableBodyCell';
import { TableRow as Row } from '../../../atoms/TableRow/TableRow';
import useI18next from '../../../context/I18nextContext';

const MeasurementTable = ({measurements, sizes, className = '', ...props}) => {

  const i18next = useI18next();

  return (
    <div {...props}>
      <table className={[styles.table, className].join(' ')}>
        <thead>
          <Row>
            <Th className={styles.th}>{i18next.t('user.item.size')}</Th>
            <Th className={styles.th}>{i18next.t('user.item.width')}</Th>
            <Th className={styles.th}>{i18next.t('user.item.shoulder-width')}</Th>
            <Th className={styles.th}>{i18next.t('user.item.raglan-sleeve-length')}</Th>
            <Th className={styles.th}>{i18next.t('user.item.sleeve-length')}</Th>
            <Th className={styles.th}>{i18next.t('user.item.length')}</Th>
            <Th className={styles.th}>{i18next.t('user.item.waist')}</Th>
            <Th className={styles.th}>{i18next.t('user.item.hip')}</Th>
            <Th className={styles.th}>{i18next.t('user.item.rise')}</Th>
            <Th className={styles.th}>{i18next.t('user.item.inseam')}</Th>
            <Th className={styles.th}>{i18next.t('user.item.thigh-width')}</Th>
            <Th className={styles.th}>{i18next.t('user.item.outseam')}</Th>
            <Th className={styles.th}>{i18next.t('user.item.sk-length')}</Th>
            <Th className={styles.th}>{i18next.t('user.item.hem-width')}</Th>
            <Th className={styles.th}>{i18next.t('user.item.weight')}</Th>
          </Row>
        </thead>
        <tbody>
        {   measurements && sizes &&
            measurements.map((list, index) =>
                <Row key={index}> 
                    {
                        sizes.filter(size => size.id == list.size_id).map(s => (
                            <Td className={[styles.td, styles.bg_gray].join(' ')} key={s.id}>{s.size_name}</Td>
                        ))
                    }
                    <Td className={styles.td}>{list.width}</Td>
                    <Td className={styles.td}>{list.shoulder_width}</Td>
                    <Td className={styles.td}>{list.raglan_sleeve_length}</Td>
                    <Td className={styles.td}>{list.sleeve_length}</Td>
                    <Td className={styles.td}>{list.length}</Td>
                    <Td className={styles.td}>{list.waist}</Td>
                    <Td className={styles.td}>{list.hip}</Td>
                    <Td className={styles.td}>{list.rise}</Td>
                    <Td className={styles.td}>{list.inseam}</Td>
                    <Td className={styles.td}>{list.thigh_width}</Td>
                    <Td className={styles.td}>{list.outseam}</Td>
                    <Td className={styles.td}>{list.sk_length}</Td>
                    <Td className={styles.td}>{list.hem_width}</Td>
                    <Td className={styles.td}>{list.weight}</Td>
                </Row>
            )
        }
        </tbody>
      </table>
    </div>
  );
};

export default MeasurementTable;
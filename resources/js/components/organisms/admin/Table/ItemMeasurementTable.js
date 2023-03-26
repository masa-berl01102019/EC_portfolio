import React, { memo } from 'react';
import styles from './styles.module.css';
import { TableHeadCell as Th } from '../../../atoms/TableHeadCell/TableHeadCell';
import { TableBodyCell as Td } from '../../../atoms/TableBodyCell/TableBodyCell';
import { TableRow as Row } from '../../../atoms/TableRow/TableRow';
import Button from '../../../atoms/Button/Button';
import Selectbox from '../../../atoms/Selectbox/Selectbox';
import InputText from '../../../atoms/InputText/InputText';
import useNotify from '../../../context/NotifyContext';
import { useTranslation } from 'react-i18next';


const ItemMeasurementTable = memo(({ measurements, sizes, className = '', deleteMethod, handleFormMethod }) => {

  const alert = useNotify();
  const { t } = useTranslation();

  const measurementData = [
    { name: 'width', placeholder: '55' },
    { name: 'shoulder_width', placeholder: '50.5' },
    { name: 'raglan_sleeve_length', placeholder: '70' },
    { name: 'sleeve_length', placeholder: '57.5' },
    { name: 'length', placeholder: '67' },
    { name: 'waist', placeholder: '77' },
    { name: 'hip', placeholder: '97' },
    { name: 'rise', placeholder: '29' },
    { name: 'inseam', placeholder: '61' },
    { name: 'thigh_width', placeholder: '59' },
    { name: 'outseam', placeholder: '90' },
    { name: 'sk_length', placeholder: '88' },
    { name: 'hem_width', placeholder: '23' },
    { name: 'weight', placeholder: '150' }
  ];

  return (
    <>
      <table className={[styles.table, className].join(' ')}>
        <thead>
          <Row>
            <Th>{t('admin.delete-btn')}</Th>
            <Th>{t('admin.item.size')}</Th>
            <Th>{t('admin.item.width')}</Th>
            <Th>{t('admin.item.shoulder-width')}</Th>
            <Th>{t('admin.item.raglan-sleeve-length')}</Th>
            <Th>{t('admin.item.sleeve-length')}</Th>
            <Th>{t('admin.item.length')}</Th>
            <Th>{t('admin.item.waist')}</Th>
            <Th>{t('admin.item.hip')}</Th>
            <Th>{t('admin.item.rise')}</Th>
            <Th>{t('admin.item.inseam')}</Th>
            <Th>{t('admin.item.thigh-width')}</Th>
            <Th>{t('admin.item.outseam')}</Th>
            <Th>{t('admin.item.sk-length')}</Th>
            <Th>{t('admin.item.hem-width')}</Th>
            <Th>{t('admin.item.weight')}</Th>
          </Row>
        </thead>
        <tbody>
          {measurements.map((list, index) =>
            <Row key={index}>
              <Td>
                <Button
                  onClick={() => {
                    if (measurements.length > 1) {
                      deleteMethod('measurements', index, list.id)
                    } else {
                      alert({ body: t('admin.item.table-alert'), type: 'alert' });
                    }
                  }}
                  style={{ 'maxWidth': '65px' }}
                >
                  {t('admin.delete-btn')}
                </Button>
              </Td>
              <Td>
                <Selectbox
                  name='size_id'
                  value={list.size_id}
                  onChange={e => { handleFormMethod('measurements', index, e) }}
                  className={styles.table_row_form}
                >
                  {list.size_id == '' && <option value={''}>{t('admin.not-set')}</option>}
                  {sizes && sizes.map((size) => (
                    <option key={size.id} value={size.id}>{size.size_name}</option>
                  ))}
                </Selectbox>
              </Td>
              {measurementData.map((item, idx) => (
                <Td key={idx}>
                  <InputText
                    type='number'
                    name={item.name}
                    onBlur={e => handleFormMethod('measurements', index, e)}
                    value={list[item.name] || null}
                    placeholder={item.placeholder}
                    className={styles.table_row_form2}
                  />
                </Td>
              ))}
            </Row>
          )}
        </tbody>
      </table>
    </>
  );
});

export default ItemMeasurementTable;
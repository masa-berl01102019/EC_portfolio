import React, {memo} from 'react';
import styles from './styles.module.css';
import {TableHeadCell as Th} from '../../../atoms/TableHeadCell/TableHeadCell';
import {TableBodyCell as Td} from '../../../atoms/TableBodyCell/TableBodyCell';
import { TableRow as Row } from '../../../atoms/TableRow/TableRow';
import Button from '../../../atoms/Button/Button';
import Selectbox from '../../../atoms/Selectbox/Selectbox';
import InputText from '../../../atoms/InputText/InputText';
import useNotify from '../../../context/NotifyContext';
import { useTranslation } from 'react-i18next';


const ItemMeasurementTable = ({measurements, sizes, className = '', deleteMethod, handleFormMethod}) => {

  const alert = useNotify();
  const { t } = useTranslation();

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
        {   measurements &&
            measurements.map((list, index) =>
                <Row key={index}>
                  <Td>
                    <Button 
                      onClick={() => {
                        if(measurements.length > 1) {
                          deleteMethod('measurements', index, list.id)
                        } else {
                          alert({
                            body : t('admin.table-alert'),
                            type: 'alert'
                          });
                        }
                      }} 
                      style={{'maxWidth': '65px'}}
                    >
                      {t('admin.delete-btn')}
                    </Button>
                  </Td>
                  <Td>
                    <Selectbox name='size_id' value={list.size_id} onChange={ e => { handleFormMethod('measurements', index, e) }} className={styles.table_row_form}>
                        {/* フォーム追加以外未設定の表示を制限 */}
                        {   list.size_id == '' && <option value={''}>{t('admin.not-set')}</option>}
                        {   sizes && sizes.map((size) => (
                                <option key={size.id} value={size.id}>{size.size_name}</option>
                            ))
                        } 
                    </Selectbox>
                  </Td>
                  <Td>
                    <InputText 
                      type='number'
                      name='width'
                      onBlur={ e => handleFormMethod('measurements', index, e) }
                      value={list.width} 
                      placeholder='55'
                      className={styles.table_row_form2}
                    />
                  </Td>
                  <Td>
                    <InputText 
                      type='number'
                      name='shoulder_width'
                      onBlur={ e => handleFormMethod('measurements', index, e) }
                      value={list.shoulder_width} 
                      placeholder='50.5'
                      className={styles.table_row_form2}
                    />
                  </Td>
                  <Td>
                    <InputText 
                      type='number'
                      name='raglan_sleeve_length'
                      onBlur={ e => handleFormMethod('measurements', index, e) }
                      value={list.raglan_sleeve_length} 
                      placeholder='70'
                      className={styles.table_row_form2}
                    />
                  </Td>
                  <Td>
                    <InputText 
                      type='number'
                      name='sleeve_length'
                      onBlur={ e => handleFormMethod('measurements', index, e) }
                      value={list.sleeve_length} 
                      placeholder='57.5'
                      className={styles.table_row_form2}
                    />
                  </Td>
                  <Td>
                    <InputText 
                      type='number'
                      name='length'
                      onBlur={ e => handleFormMethod('measurements', index, e) }
                      value={list.length} 
                      placeholder='67'
                      className={styles.table_row_form2}
                    />
                  </Td>    
                  <Td>
                    <InputText 
                      type='number'
                      name='waist'
                      onBlur={ e => handleFormMethod('measurements', index, e) }
                      value={list.waist}
                      placeholder='77'
                      className={styles.table_row_form2}
                    />
                  </Td>
                  <Td>
                    <InputText 
                      type='number'
                      name='hip'
                      onBlur={ e => handleFormMethod('measurements', index, e) }
                      value={list.hip}
                      placeholder='97'
                      className={styles.table_row_form2}
                    />
                  </Td>
                  <Td>
                    <InputText 
                      type='number'
                      name='rise'
                      onBlur={ e => handleFormMethod('measurements', index, e) }
                      value={list.rise}
                      placeholder='29'
                      className={styles.table_row_form2}
                    />
                  </Td>
                  <Td>
                    <InputText 
                      type='number'
                      name='inseam'
                      onBlur={ e => handleFormMethod('measurements', index, e) }
                      value={list.inseam}
                      placeholder='61'
                      className={styles.table_row_form2}
                    />
                  </Td>
                  <Td>
                    <InputText 
                      type='number'
                      name='thigh_width'
                      onBlur={ e => handleFormMethod('measurements', index, e) }
                      value={list.thigh_width}
                      placeholder='59'
                      className={styles.table_row_form2}
                    />
                  </Td>
                  <Td>
                    <InputText 
                      type='number'
                      name='outseam'
                      onBlur={ e => handleFormMethod('measurements', index, e) }
                      value={list.outseam}
                      placeholder='90'
                      className={styles.table_row_form2}
                    />
                  </Td>
                  <Td>
                    <InputText 
                      type='number'
                      name='sk_length'
                      onBlur={ e => handleFormMethod('measurements', index, e) }
                      value={list.sk_length}
                      placeholder='88'
                      className={styles.table_row_form2}
                    />
                  </Td>
                  <Td>
                    <InputText 
                      type='number'
                      name='hem_width'
                      onBlur={ e => handleFormMethod('measurements', index, e) }
                      value={list.hem_width}
                      placeholder='23'
                      className={styles.table_row_form2}
                    />
                  </Td>
                  <Td>
                    <InputText 
                      type='number'
                      name='weight'
                      onBlur={ e => handleFormMethod('measurements', index, e) }
                      value={list.weight}
                      placeholder='150'
                      className={styles.table_row_form2}
                    />
                  </Td>
                </Row>
            )
        }
        </tbody>
      </table>
    </>
  );
};

export default ItemMeasurementTable;
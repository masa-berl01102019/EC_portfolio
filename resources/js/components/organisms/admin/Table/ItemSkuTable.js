import React, {memo} from 'react';
import styles from './styles.module.css';
import {TableHeadCell as Th} from '../../../atoms/TableHeadCell/TableHeadCell';
import {TableBodyCell as Td} from '../../../atoms/TableBodyCell/TableBodyCell';
import { TableRow as Row } from '../../../atoms/TableRow/TableRow';
import Button from '../../../atoms/Button/Button';
import Selectbox from '../../../atoms/Selectbox/Selectbox';
import InputText from '../../../atoms/InputText/InputText';
import useNotify from '../../../context/NotifyContext';
import useI18next from '../../../context/I18nextContext';


const ItemSkuTable = ({skus, colors, sizes, className = '', deleteMethod, handleFormMethod}) => {

  const alert = useNotify();
  const i18next = useI18next();

  return (
    <>
      <table className={[styles.table, className].join(' ')}>
        <thead>
          <Row>
            <Th>{i18next.t('admin.delete-btn')}</Th>
            <Th>{i18next.t('admin.item.size')}</Th>
            <Th>{i18next.t('admin.item.color')}</Th>
            <Th>{i18next.t('admin.item.quantity')}</Th>
          </Row>
        </thead>
        <tbody>
        {   skus &&
            skus.map((list, index) =>
              <Row key={index}>
                    <Td>
                        <Button 
                          onClick={() => {
                            if(skus.length > 1) {
                              deleteMethod('skus', index, list.id)
                            } else {
                              alert({
                                body : i18next.t('admin.table-alert'),
                                type: 'alert'
                              });
                            }
                          }} 
                          style={{'maxWidth': '65px'}}
                        >
                          {i18next.t('admin.delete-btn')}
                        </Button>
                    </Td>
                    <Td>
                        <Selectbox name='size_id' value={list.size_id} onChange={ e => handleFormMethod('skus', index, e) } className={styles.table_row_form}>
                            {/* フォーム追加以外未設定の表示を制限 */}
                            { list.size_id == '' && <option value={''}>{i18next.t('admin.not-set')}</option>}
                            { sizes && sizes.map( size => ( <option key={size.id} value={size.id}>{size.size_name}</option>)) }
                        </Selectbox>
                    </Td>
                    <Td>
                        <Selectbox name='color_id' value={list.color_id} onChange={ e => handleFormMethod('skus', index, e) } className={styles.table_row_form}>
                            {/* フォーム追加以外未設定の表示を制限 */}
                            { list.color_id == '' && <option value={''}>{i18next.t('admin.not-set')}</option>}
                            { colors && colors.map( color => ( <option key={color.id} value={color.id}>{color.color_name}</option>)) }
                        </Selectbox>
                    </Td>
                    <Td>
                      <InputText type='number' name='quantity' onBlur={ e => handleFormMethod('skus', index, e) } value={list.quantity} placeholder='12' className={styles.table_row_form} />
                    </Td>
              </Row>
            )
        }
        </tbody>
      </table>
    </>
  );
};

export default ItemSkuTable;
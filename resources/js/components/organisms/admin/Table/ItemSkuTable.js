import React, {memo} from 'react';
import styles from './styles.module.css';
import {TableHeadCell as Th} from '../../../atoms/TableHeadCell/TableHeadCell';
import {TableBodyCell as Td} from '../../../atoms/TableBodyCell/TableBodyCell';
import { TableRow as Row } from '../../../atoms/TableRow/TableRow';
import Button from '../../../atoms/Button/Button';
import Selectbox from '../../../atoms/Selectbox/Selectbox';
import InputText from '../../../atoms/InputText/InputText';
import useNotify from '../../../context/NotifyContext';


const ItemSkuTable = ({skus, colors, sizes, className = '', deleteMethod, handleFormMethod}) => {

  // notifyContextの呼び出し
  const alert = useNotify();

  return (
    <>
      <table className={[styles.table, className].join(' ')}>
        <thead>
          <Row>
            <Th>削除</Th>
            <Th>サイズ</Th>
            <Th>カラー</Th>
            <Th>在庫数</Th>
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
                                body : '全ての行は削除出来ません。',
                                type: 'alert'
                              });
                            }
                          }} 
                          style={{'maxWidth': '50px'}}
                        >
                          削除
                        </Button>
                    </Td>
                    <Td>
                        <Selectbox name='size_id' value={list.size_id} onChange={ e => handleFormMethod('skus', index, e) } className={styles.table_row_form}>
                            {/* フォーム追加以外未設定の表示を制限 */}
                            { list.size_id == '' && <option value={''}>未設定</option>}
                            { sizes && sizes.map( size => ( <option key={size.id} value={size.id}>{size.size_name}</option>)) }
                        </Selectbox>
                    </Td>
                    <Td>
                        <Selectbox name='color_id' value={list.color_id} onChange={ e => handleFormMethod('skus', index, e) } className={styles.table_row_form}>
                            {/* フォーム追加以外未設定の表示を制限 */}
                            { list.color_id == '' && <option value={''}>未設定</option>}
                            { colors && colors.map( color => ( <option key={color.id} value={color.id}>{color.color_name}</option>)) }
                        </Selectbox>
                    </Td>
                    <Td>
                      <InputText type='number' name='quantity' onBlur={ e => handleFormMethod('skus', index, e) } value={list.quantity} placeholder='数値' className={styles.table_row_form} />
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
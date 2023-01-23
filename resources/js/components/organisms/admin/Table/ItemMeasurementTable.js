import React, {memo} from 'react';
import styles from './styles.module.css';
import {TableHeadCell as Th} from '../../../atoms/TableHeadCell/TableHeadCell';
import {TableBodyCell as Td} from '../../../atoms/TableBodyCell/TableBodyCell';
import { TableRow as Row } from '../../../atoms/TableRow/TableRow';
import Button from '../../../atoms/Button/Button';
import Selectbox from '../../../atoms/Selectbox/Selectbox';
import InputText from '../../../atoms/InputText/InputText';


const ItemMeasurementTable = ({measurements, sizes, skus, className = '', deleteMethod, handleFormMethod}) => {

  return (
    <>
      <table className={[styles.table, className].join(' ')}>
        <thead>
          <Row>
            <Th>削除</Th>
            <Th>サイズ</Th>
            <Th>身幅</Th>
            <Th>肩幅</Th>
            <Th>裄丈</Th>
            <Th>袖丈</Th>
            <Th>着丈</Th>
            <Th>ウエスト</Th>
            <Th>ヒップ</Th>
            <Th>股上</Th>
            <Th>股下</Th>
            <Th>わたり</Th>
            <Th>パンツ総丈</Th>
            <Th>スカート丈</Th>
            <Th>裾幅</Th>
            <Th>重量</Th>
          </Row>
        </thead>
        <tbody>
        {   measurements &&
            measurements.map((list, index) =>
                <Row key={index}>
                  <Td>
                    <Button onClick={() => deleteMethod('measurements', index, list.id) } style={{'maxWidth': '50px'}}>削除</Button>
                  </Td>
                  <Td>
                    <Selectbox name='size_id' value={list.size_id} onChange={ e => {
                        if(measurements.map(item => item['size_id']).includes(Number(e.target.value))) {
                            alert('選択されたサイズは既に使用されております。');
                        } else {
                            handleFormMethod('measurements', index, e) 
                        }
                    }} className={styles.table_row_form}>
                        {/* フォーム追加以外未設定の表示を制限 */}
                        {   list.size_id == '' && <option value={''}>未設定</option>}
                        {   sizes && sizes.filter((size) => skus.map(item => item.size_id).includes(size.id)).map((size) => (
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
                      placeholder='数値'
                      className={styles.table_row_form2}
                    />
                  </Td>
                  <Td>
                    <InputText 
                      type='number'
                      name='shoulder_width'
                      onBlur={ e => handleFormMethod('measurements', index, e) }
                      value={list.shoulder_width} 
                      placeholder='数値'
                      className={styles.table_row_form2}
                    />
                  </Td>
                  <Td>
                    <InputText 
                      type='number'
                      name='raglan_sleeve_length'
                      onBlur={ e => handleFormMethod('measurements', index, e) }
                      value={list.raglan_sleeve_length} 
                      placeholder='数値'
                      className={styles.table_row_form2}
                    />
                  </Td>
                  <Td>
                    <InputText 
                      type='number'
                      name='sleeve_length'
                      onBlur={ e => handleFormMethod('measurements', index, e) }
                      value={list.sleeve_length} 
                      placeholder='数値'
                      className={styles.table_row_form2}
                    />
                  </Td>
                  <Td>
                    <InputText 
                      type='number'
                      name='length'
                      onBlur={ e => handleFormMethod('measurements', index, e) }
                      value={list.length} 
                      placeholder='数値'
                      className={styles.table_row_form2}
                    />
                  </Td>
                  <Td>
                    <InputText 
                      type='number'
                      name='waist'
                      onBlur={ e => handleFormMethod('measurements', index, e) }
                      value={list.waist}
                      placeholder='数値'
                      className={styles.table_row_form2}
                    />
                  </Td>
                  <Td>
                    <InputText 
                      type='number'
                      name='hip'
                      onBlur={ e => handleFormMethod('measurements', index, e) }
                      value={list.hip}
                      placeholder='数値'
                      className={styles.table_row_form2}
                    />
                  </Td>
                  <Td>
                    <InputText 
                      type='number'
                      name='rise'
                      onBlur={ e => handleFormMethod('measurements', index, e) }
                      value={list.rise}
                      placeholder='数値'
                      className={styles.table_row_form2}
                    />
                  </Td>
                  <Td>
                    <InputText 
                      type='number'
                      name='inseam'
                      onBlur={ e => handleFormMethod('measurements', index, e) }
                      value={list.inseam}
                      placeholder='数値'
                      className={styles.table_row_form2}
                    />
                  </Td>
                  <Td>
                    <InputText 
                      type='number'
                      name='thigh_width'
                      onBlur={ e => handleFormMethod('measurements', index, e) }
                      value={list.thigh_width}
                      placeholder='数値'
                      className={styles.table_row_form2}
                    />
                  </Td>
                  <Td>
                    <InputText 
                      type='number'
                      name='outseam'
                      onBlur={ e => handleFormMethod('measurements', index, e) }
                      value={list.outseam}
                      placeholder='数値'
                      className={styles.table_row_form2}
                    />
                  </Td>
                  <Td>
                    <InputText 
                      type='number'
                      name='sk_length'
                      onBlur={ e => handleFormMethod('measurements', index, e) }
                      value={list.sk_length}
                      placeholder='数値'
                      className={styles.table_row_form2}
                    />
                  </Td>
                  <Td>
                    <InputText 
                      type='number'
                      name='hem_width'
                      onBlur={ e => handleFormMethod('measurements', index, e) }
                      value={list.hem_width}
                      placeholder='数値'
                      className={styles.table_row_form2}
                    />
                  </Td>
                  <Td>
                    <InputText 
                      type='number'
                      name='weight'
                      onBlur={ e => handleFormMethod('measurements', index, e) }
                      value={list.weight}
                      placeholder='数値'
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
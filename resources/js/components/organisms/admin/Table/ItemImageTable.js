import React, {memo} from 'react';
import styles from './styles.module.css';
import {TableHeadCell as Th} from '../../../atoms/TableHeadCell/TableHeadCell';
import {TableBodyCell as Td} from '../../../atoms/TableBodyCell/TableBodyCell';
import { TableRow as Row } from '../../../atoms/TableRow/TableRow';
import Button from '../../../atoms/Button/Button';
import Selectbox from '../../../atoms/Selectbox/Selectbox';
import InputImage from '../../../atoms/InputImage/InputImage';
import useNotify from '../../../context/NotifyContext';


const ItemImageTable = ({images, colors, skus, className = '', deleteMethod, handleFormMethod}) => {

  // notifyContextの呼び出し
  const alert = useNotify();

  return (
    <>
      <table className={[styles.table, className].join(' ')}>
        <thead>
          <Row>
            <Th>削除</Th>
            <Th>画像ID</Th>
            <Th>画像</Th>
            <Th>画像種別</Th>
            <Th>関連カラー</Th>
          </Row>
        </thead>
        <tbody>
        {   images &&
            images.map((list, index) =>
                <Row key={index}>
                    <Td>
                      <Button 
                        onClick={() => {
                          if(images.length > 1) {
                            deleteMethod('images', index, list.id)
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
                    <Td>{list.id}</Td>
                    <Td>
                      <InputImage
                          src={list.image ? list.image : '/img/no_image.png'}
                          name="image"
                          onChange={ e => handleFormMethod('images', index, e)}
                          style={{'width' : '50px', 'height' : '50px'}}
                        />
                    </Td>
                    <Td>
                      <Selectbox name='image_category' value={list.image_category} onChange={ e => handleFormMethod('images', index, e) } className={styles.table_row_form}>
                          {/* フォーム追加以外未設定の表示を制限 */}
                          { list.image_category === '' && <option value={''}>未設定</option>}
                          <option value={0}>メイン画像</option>
                          <option value={1}>サムネイル画像</option>
                      </Selectbox>
                    </Td>
                    <Td>
                      <Selectbox name='color_id' value={list.color_id} onChange={ e => handleFormMethod('images', index, e) }  className={styles.table_row_form}>
                        {/* フォーム追加以外未設定の表示を制限 */}
                        { list.color_id == '' && <option value={''}>未設定</option>}
                        { colors && colors.filter((color) => skus.map(item => item.color_id).includes(color.id)).map((color) => (
                            <option key={color.id} value={color.id}>{color.color_name}</option>
                          ))
                        }
                      </Selectbox>
                    </Td>
                </Row>
            )
        }
        </tbody>
      </table>
    </>
  );
};

export default ItemImageTable;
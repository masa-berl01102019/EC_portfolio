import React, {memo} from 'react';
import styles from './styles.module.css';
import {TableHeadCell as Th} from '../../../atoms/TableHeadCell/TableHeadCell';
import {TableBodyCell as Td} from '../../../atoms/TableBodyCell/TableBodyCell';
import { TableRow as Row } from '../../../atoms/TableRow/TableRow';
import Button from '../../../atoms/Button/Button';
import Selectbox from '../../../atoms/Selectbox/Selectbox';
import InputImage from '../../../atoms/InputImage/InputImage';
import useNotify from '../../../context/NotifyContext';
import { useTranslation } from 'react-i18next';


const ItemImageTable = ({images, colors, className = '', deleteMethod, handleFormMethod}) => {

  const alert = useNotify();
  const { t } = useTranslation();

  return (
    <>
      <table className={[styles.table, className].join(' ')}>
        <thead>
          <Row>
            <Th>{t('admin.delete-btn')}</Th>
            <Th>{t('admin.item.image')}</Th>
            <Th>{t('admin.item.image-type')}</Th>
            <Th>{t('admin.item.related-color')}</Th>
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
                      <InputImage
                          src={list.image ? list.image : '/img/no_image.png'}
                          name="image"
                          onChange={ e => handleFormMethod('images', index, e)}
                          style={{'width' : '50px', 'height' : '50px'}}
                        />
                    </Td>
                    <Td>
                      <Selectbox 
                        name='image_category' 
                        value={list.image_category} 
                        onChange={ e => {
                          if(images.map(img => img.image_category).includes(0) && Number(e.target.value) === 0) {
                            alert({
                              body : t('admin.item.table-alert-img'),
                              type: 'alert'
                            });
                          } else {
                            handleFormMethod('images', index, e);
                          }
                        }} 
                        className={styles.table_row_form}
                        >
                          { list.image_category === '' && <option value={''}>{t('admin.not-set')}</option>}
                          <option value={0}>{t('admin.item.image-main')}</option>
                          <option value={1}>{t('admin.item.image-sub')}</option>
                      </Selectbox>
                    </Td>
                    <Td>
                      <Selectbox name='color_id' value={list.color_id} onChange={ e => handleFormMethod('images', index, e) }  className={styles.table_row_form}>
                        { list.color_id == '' && <option value={''}>{t('admin.not-set')}</option>}
                        { colors && colors.map((color) => (
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
import React, {memo} from 'react';
import InputText from '../../atoms/InputText/InputText';
import Text from '../../atoms/Text/Text';
import styles from './styles.module.css';

const PaginationCounter = ({meta, onBlur}) => {

  return (
    <label className={styles.flex}>
      <Text className={styles.set_row_label}>行数</Text>
      <InputText type='number' onBlur={onBlur} value={meta.per_page} className={styles.set_row_input}/>
    </label>
  );

};

export default PaginationCounter;
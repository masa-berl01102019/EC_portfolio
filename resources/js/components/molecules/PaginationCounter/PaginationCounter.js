import React, {memo} from 'react';
import InputText from '../../atoms/InputText/InputText';
import Text from '../../atoms/Text/Text';
import styles from './styles.module.css';
import useI18next from '../../context/I18nextContext';

const PaginationCounter = ({meta, onBlur}) => {

  const i18next = useI18next();

  return (
    <label className={styles.flex}>
      <Text className={styles.set_row_label}>{i18next.t('admin.per-page')}</Text>
      <InputText type='number' onBlur={onBlur} value={meta.per_page} className={styles.set_row_input}/>
    </label>
  );

};

export default PaginationCounter;
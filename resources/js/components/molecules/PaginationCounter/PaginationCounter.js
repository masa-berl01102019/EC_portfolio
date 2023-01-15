import React, {memo} from 'react';
import InputText from '../../atoms/InputText/InputText';
import Text from '../../atoms/Text/Text';
import styles from './styles.module.css';
import { useTranslation } from 'react-i18next';

const PaginationCounter = ({meta, onBlur}) => {

  const { t } = useTranslation();

  return (
    <label className={styles.flex}>
      <Text className={styles.set_row_label}>{t('admin.per-page')}</Text>
      <InputText type='number' onBlur={onBlur} value={meta.per_page} className={styles.set_row_input}/>
    </label>
  );

};

export default PaginationCounter;
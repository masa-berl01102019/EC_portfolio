import React from 'react';
import DatePicker from '../../atoms/DatePicker/DatePicker';
import Pulldown from '../Pullldown/Pulldown';
import Text from '../../atoms/Text/Text';
import useCreateParams from '../../hooks/useCreateParams';
import styles from './styles.module.css';
import { useTranslation } from 'react-i18next';


const DateRangeFilter = ({ children, params, model, className }) => {

  const { handleFilter, handleFilterDate, handleFilterDateClear } = useCreateParams(model);
  const { t } = useTranslation();

  return (
    <div className={className}>
      <Text className={styles.mb_8}>{t('admin.specified-period')}</Text>
      <Pulldown
        name={'target_span'}
        value={params.target_span}
        onChange={e => {
          if (params.target_span !== '' && e.target.value == '') {
            handleFilterDateClear();
          } else {
            handleFilter(e);
          }
        }}
        initialLabel={t('admin.not-set')}
      >
        {children}
      </Pulldown>
      {params.target_span !== '' &&
        <div className={styles.date_picker_area}>
          <DatePicker name={'from'} value={params.from} onChange={handleFilterDate} className={styles.w_100} />
          <Text className={styles.ma}>~</Text>
          <DatePicker name={'to'} value={params.to} onChange={handleFilterDate} className={styles.w_100} />
        </div>
      }
    </div>
  );
}

export default DateRangeFilter;
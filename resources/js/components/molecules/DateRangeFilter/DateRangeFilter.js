import React from 'react';
import DatePicker from '../../atoms/DatePicker/DatePicker';
import Pulldown from '../../atoms/Pullldown/Pulldown';
import Text from '../../atoms/Text/Text';
import useCreateParams from '../../hooks/useCreateParams';
import styles from './styles.module.css';
import { useTranslation } from 'react-i18next';


const DateRangeFilter = ({children, params, model}) => {

  const {handleFilter, handleFilterDate, handleFilterDateClear} = useCreateParams(model);
  const { t } = useTranslation();

  return (
    <>
      <Text className={styles.mb}>{t('admin.specified-period')}</Text>
      <div>
          <div className={styles.mb}>
            <Pulldown name={'target_span'} value={params.target_span} onChange={ e => {
              if( params.target_span !== '' && e.target.value == '') {
                handleFilterDateClear();
              } else {
                handleFilter(e);
              }
            }} defaultOption={t('admin.not-set')}>
              {children}
            </Pulldown>
          </div>

          { params.target_span !== '' &&
            <div className={styles.flex}>
              <DatePicker name={'from'} value={params.from} onChange={handleFilterDate} style={{'width': '114px'}}/>
              <Text className={styles.ma}>~</Text>
              <DatePicker name={'to'} value={params.to} onChange={handleFilterDate} style={{'width': '114px'}}/>
            </div>
          }
      </div>
    </>
  );
}

export default DateRangeFilter;
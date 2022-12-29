import React, {memo} from 'react';
import { useRecoilValue } from 'recoil';
import { paramState } from '../../../store/paramState';
import useCreateParams from '../../../hooks/useCreateParams';
import InputText from '../../../atoms/InputText/InputText';
import Pulldown from '../../../atoms/Pullldown/Pulldown';
import Text from '../../../atoms/Text/Text';
import DateRangeFilter from '../../../molecules/DateRangeFilter/DateRangeFilter';
import styles from './styles.module.css';
import Button from '../../../atoms/Button/Button';
import useI18next from '../../../context/I18nextContext';

const NotificationSidebar = ({model, onClick}) => {

    const params = useRecoilValue(paramState(model));
    const{handleFilter, handleSort} = useCreateParams(model);
    const i18next = useI18next();

    return (
      <div className={styles.sidebar}>
        <div className={styles.container}>

          <Text size='l' className={styles.sec_title}>{i18next.t('admin.filter')}</Text>

          <div className={styles.mb_16}>
              <label htmlFor='search'>
                <Text className={styles.mb_8}>{i18next.t('admin.keyword')}</Text>
              </label>
              <InputText
                type='text' 
                name='search' 
                onBlur={handleFilter} 
                value={params.filter.search} 
                placeholder={i18next.t('admin.notification.keyword-ex')}
                className={styles.w_100}
              />
          </div>
          <div className={styles.mb_16}>
            <Text className={styles.mb_8}>{i18next.t('admin.published-status')}</Text>
            <Pulldown name='is_published' value={params.filter.is_published} onChange={handleFilter} defaultOption={i18next.t('admin.not-set')}> 
              <option value={'0'}>{i18next.t('admin.unpublished')}</option>
              <option value={'1'}>{i18next.t('admin.published')}</option>
            </Pulldown>
          </div>
          <div className={styles.mb_32}>
            <DateRangeFilter params={params.filter} model={model}>
              <option value={'expired_at'}>{i18next.t('admin.notification.expired-date')}</option>
              <option value={'posted_at'}>{i18next.t('admin.posted-date')}</option>
              <option value={'modified_at'}>{i18next.t('admin.updated-date')}</option>
            </DateRangeFilter>
          </div>

          <Text size='l' className={styles.sec_title}>{i18next.t('admin.sort')}</Text>

          <div className={styles.mb_16}>
            <Text className={styles.mb_8}>{i18next.t('admin.notification.expired-date')}</Text>
            <Pulldown name='expired_at' value={params.sort.expired_at} onChange={handleSort} defaultOption={i18next.t('admin.not-set')}>
              <option value={'desc'}>{i18next.t('admin.desc-date')}</option>
              <option value={'asc'}>{i18next.t('admin.asc-date')}</option>
            </Pulldown>
          </div>
          <div className={styles.mb_16}>
            <Text className={styles.mb_8}>{i18next.t('admin.posted-date')}</Text>
            <Pulldown name='posted_at' value={params.sort.posted_at} onChange={handleSort} defaultOption={i18next.t('admin.not-set')}>
              <option value={'desc'}>{i18next.t('admin.desc-date')}</option>
              <option value={'asc'}>{i18next.t('admin.asc-date')}</option>
            </Pulldown>
          </div>
          <div>
            <Text className={styles.mb_8}>{i18next.t('admin.updated-date')}</Text>
            <Pulldown name='modified_at' value={params.sort.modified_at} onChange={handleSort} defaultOption={i18next.t('admin.not-set')}>
              <option value={'desc'}>{i18next.t('admin.desc-date')}</option>
              <option value={'asc'}>{i18next.t('admin.asc-date')}</option>
            </Pulldown>
          </div>

          <Button className={styles.close_btn} onClick={onClick}>{i18next.t('admin.close-btn')}</Button>
        </div>
      </div>
    );

};

export default NotificationSidebar;